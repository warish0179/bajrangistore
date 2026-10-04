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
      // Seller sees orders containing their products
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
        user: { select: { name: true, email: true, phone: true } },
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
      paymentMethod = "UPI",
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

    const orderNumber = `NEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const trackingNumber = `BD-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.id,
        totalAmount: subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        finalAmount,
        status: "CONFIRMED",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        paymentMethod,
        transactionId,
        trackingNumber,
        courierName: "BlueDart Express",
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
              status: "CONFIRMED",
              title: "Order Placed & Confirmed",
              description: `Payment verified via ${paymentMethod}. Order received by NexMart fulfillment network.`,
              location: "NexMart Automated Gateway",
            },
          ],
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Clear server cart for user
    await prisma.cartItem.deleteMany({
      where: { userId: session.id },
    });

    // Create confirmation notification
    await prisma.notification.create({
      data: {
        userId: session.id,
        title: `Order Confirmed: ${orderNumber} 🎉`,
        message: `Your order for ₹${finalAmount} has been placed successfully. Track shipment in real-time.`,
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
