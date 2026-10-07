import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { orderId, orderNumber, transactionRef, paymentMethod, receiptImage } = await req.json();

    if (!transactionRef || !transactionRef.trim()) {
      return NextResponse.json({ error: "Transaction Reference (UTR number) is required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create payment transaction log
    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        userId: session.id,
        amount: order.finalAmount,
        paymentMethod: paymentMethod || order.paymentMethod,
        transactionRef: transactionRef.trim(),
        receiptImage: receiptImage || null,
        status: "PENDING_VERIFICATION",
      },
    });

    // Update order with transactionId and status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        transactionId: transactionRef.trim(),
        paymentStatus: "PENDING_VERIFICATION",
      },
    });

    // Add to timeline
    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: "PAYMENT_SUBMITTED",
        title: "Payment UTR Submitted",
        description: `Reference ${transactionRef.trim()} submitted via ${paymentMethod || order.paymentMethod}. Awaiting Admin Verification.`,
        location: "Bajrangi Payment Receiving Center",
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        userId: session.id,
        title: "Payment Submitted for Verification",
        message: `Your payment UTR ${transactionRef.trim()} for Order #${order.orderNumber} is received and queued for instant verification.`,
        type: "ORDER",
        link: `/account/orders/${order.orderNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment transaction submitted successfully. Admin verification pending.",
      transaction,
    });
  } catch (error) {
    console.error("Payment verification submission error:", error);
    return NextResponse.json({ error: "Failed to submit payment verification" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { transactionId, status, adminNote } = await req.json();

    if (!transactionId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Valid transactionId and status (APPROVED/REJECTED) required." }, { status: 400 });
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { order: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Payment transaction not found" }, { status: 404 });
    }

    const updatedTx = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status,
        verifiedBy: session.id,
        verifiedAt: new Date(),
        adminNote: adminNote || (status === "APPROVED" ? "Verified against bank settlement." : "Invalid UTR reference."),
      },
    });

    if (status === "APPROVED") {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "PAID",
          status: transaction.order.status === "PAYMENT_PENDING" ? "CONFIRMED" : transaction.order.status,
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: transaction.orderId,
          status: "PAYMENT_VERIFIED",
          title: "Payment Verified & Approved",
          description: `Transaction ${transaction.transactionRef || ""} verified successfully by Store Administration.`,
          location: "Bajrangi Finance Desk",
        },
      });

      await prisma.notification.create({
        data: {
          userId: transaction.userId,
          title: "Payment Confirmed! 🎉",
          message: `Your payment of ₹${transaction.amount.toLocaleString()} for Order #${transaction.order.orderNumber} has been verified and confirmed!`,
          type: "ORDER",
          link: `/account/orders/${transaction.order.orderNumber}`,
        },
      });
    } else {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "FAILED",
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: transaction.orderId,
          status: "PAYMENT_REJECTED",
          title: "Payment Verification Failed",
          description: adminNote || "Transaction reference could not be verified.",
          location: "Bajrangi Finance Desk",
        },
      });

      await prisma.notification.create({
        data: {
          userId: transaction.userId,
          title: "Payment Verification Notice ⚠️",
          message: `Your payment reference for Order #${transaction.order.orderNumber} could not be verified. Note: ${adminNote || "Please retry or submit a valid UTR."}`,
          type: "ORDER",
          link: `/account/orders/${transaction.order.orderNumber}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Transaction ${status.toLowerCase()} successfully`,
      transaction: updatedTx,
    });
  } catch (error) {
    console.error("Payment status update error:", error);
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 });
  }
}
