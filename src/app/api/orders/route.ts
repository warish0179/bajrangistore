import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};

    if (session.role === "CUSTOMER") {
      where.userId = session.id;
    } else if (session.role === "SELLER") {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.id },
      });
      if (sellerProfile) {
        where.items = {
          some: {
            product: {
              sellerId: sellerProfile.id,
            },
          },
        };
      }
    } else if (session.role === "DELIVERY_WORKER") {
      const deliveryProfile = await prisma.deliveryProfile.findUnique({
        where: { userId: session.id },
      });
      if (deliveryProfile) {
        where.OR = [
          { deliveryWorkerId: deliveryProfile.id },
          { deliveryWorkerId: null, status: { in: ["READY_FOR_PICKUP", "PACKED"] } },
        ];
      }
    }
    // Admin sees all orders

    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        timeline: { orderBy: { timestamp: "desc" } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        deliveryWorker: {
          include: {
            user: { select: { name: true, phone: true } },
          },
        },
        paymentTransactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });
    }

    const body = await req.json();
    const {
      items = [],
      shippingAddress,
      paymentMethod = "UPI_QR",
      transactionRef,
      receiptImage,
      couponCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => {
      const price = item.variant ? item.variant.salePrice : item.product.salePrice;
      return acc + price * item.quantity;
    }, 0);

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === "PERCENT") {
          const calc = (subtotal * coupon.discountValue) / 100;
          discountAmount = coupon.maxDiscount ? Math.min(calc, coupon.maxDiscount) : calc;
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { timesUsed: { increment: 1 } },
        });
      }
    }

    const shippingFee = subtotal >= 499 ? 0 : 70;
    const taxAmount = Math.round(subtotal * 0.05);
    const finalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

    // Verify wallet balance if paying with WALLET
    if (paymentMethod === "WALLET") {
      const dbUser = await prisma.user.findUnique({ where: { id: session.id } });
      if (!dbUser || (dbUser.walletBalance || 0) < finalAmount) {
        return NextResponse.json(
          {
            error: `Insufficient BajrangiStore Wallet balance (Available: ₹${dbUser?.walletBalance || 0}, Required: ₹${finalAmount})`,
          },
          { status: 400 }
        );
      }

      // Deduct wallet balance
      await prisma.user.update({
        where: { id: session.id },
        data: { walletBalance: { decrement: finalAmount } },
      });
    }

    const orderNumber = `BJR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `BJR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

    // Determine initial statuses
    let initialStatus = "CONFIRMED";
    let paymentStatus = "PAID";

    if (paymentMethod === "COD") {
      initialStatus = "CONFIRMED";
      paymentStatus = "PENDING";
    } else if (paymentMethod === "UPI_QR" || paymentMethod === "BANK_TRANSFER") {
      initialStatus = "PAYMENT_PENDING";
      paymentStatus = "PENDING_VERIFICATION";
    } else if (paymentMethod === "WALLET") {
      initialStatus = "CONFIRMED";
      paymentStatus = "PAID";
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.id,
        totalAmount: subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        finalAmount,
        status: initialStatus,
        paymentStatus,
        paymentMethod,
        transactionId: transactionRef || `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        trackingNumber,
        courierName: "Bajrangi HyperLogistics",
        deliveryOtp,
        codCollected: false,
        codAmount: paymentMethod === "COD" ? finalAmount : 0,
        shippingAddress: typeof shippingAddress === "string" ? shippingAddress : JSON.stringify(shippingAddress),
        items: {
          create: items.map((item: any) => {
            const price = item.variant ? item.variant.salePrice : item.product.salePrice;
            return {
              productId: item.productId,
              variantId: item.variantId || null,
              productTitle: item.product.title,
              variantName: item.variant?.name || null,
              productImage: item.product.images?.[0]?.url || item.product.images?.[0] || "",
              price,
              quantity: item.quantity,
              total: price * item.quantity,
            };
          }),
        },
        timeline: {
          create: [
            {
              status: initialStatus,
              title: paymentMethod === "COD" ? "Order Placed (Cash on Delivery)" : "Order Placed & Logged",
              description:
                paymentMethod === "WALLET"
                  ? `Instant payment of ₹${finalAmount} settled via BajrangiStore Wallet Balance.`
                  : paymentMethod === "UPI_QR" || paymentMethod === "BANK_TRANSFER"
                  ? `Payment reference ${transactionRef || "pending"} received. Queued for Admin Verification.`
                  : "Order received by BajrangiStore fulfillment network.",
              location: "Bajrangi HyperLogistics Hub",
            },
          ],
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Create payment transaction record
    if (paymentMethod === "UPI_QR" || paymentMethod === "BANK_TRANSFER" || paymentMethod === "WALLET") {
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          userId: session.id,
          amount: finalAmount,
          paymentMethod,
          transactionRef: transactionRef || (paymentMethod === "WALLET" ? `WALLET-${order.orderNumber}` : null),
          receiptImage: receiptImage || null,
          status: paymentMethod === "WALLET" ? "APPROVED" : "PENDING_VERIFICATION",
          verifiedBy: paymentMethod === "WALLET" ? "SYSTEM_WALLET" : null,
          verifiedAt: paymentMethod === "WALLET" ? new Date() : null,
          adminNote: paymentMethod === "WALLET" ? "Settled instantly via customer wallet." : "Awaiting verification.",
        },
      });
    }

    // Clear server cart for user
    await prisma.cartItem.deleteMany({
      where: { userId: session.id },
    });

    // Create confirmation notification
    await prisma.notification.create({
      data: {
        userId: session.id,
        title: `Order Placed: ${orderNumber} 🎉`,
        message: `Your order for ₹${finalAmount.toLocaleString()} has been placed. Your secret Doorstep Delivery OTP is ${deliveryOtp}.`,
        type: "ORDER",
        link: `/account/orders/${orderNumber}`,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
