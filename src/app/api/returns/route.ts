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
    const orderId = searchParams.get("orderId");

    let whereClause: any = { userId: session.id };
    if (session.role === "ADMIN") {
      whereClause = {};
    }
    if (orderId) {
      whereClause.orderId = orderId;
    }

    const returnRequests = await prisma.returnRequest.findMany({
      where: whereClause,
      include: {
        order: {
          include: { items: true },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, returnRequests });
  } catch (error) {
    console.error("Return requests GET error:", error);
    return NextResponse.json({ error: "Failed to fetch return requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      orderId,
      type = "RETURN", // RETURN or REPLACEMENT
      reason,
      condition = "UNOPENED",
      refundType = "WALLET",
      images = [],
    } = body;

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: "Order ID and reason for return/replacement are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        userId: session.id,
        type: type.toUpperCase(),
        reason: reason.trim(),
        condition,
        refundType,
        images: JSON.stringify(images),
        status: "PENDING",
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "RETURN_REQUESTED",
        returnReason: reason,
      },
    });

    // Log timeline
    await prisma.orderTimeline.create({
      data: {
        orderId,
        status: "RETURN_REQUESTED",
        title: `${type === "REPLACEMENT" ? "Replacement" : "Return"} Request Initiated`,
        description: `Reason: ${reason}. Awaiting pickup schedule and QC verification.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${type === "REPLACEMENT" ? "Replacement" : "Return"} request submitted successfully.`,
      returnRequest,
    });
  } catch (error) {
    console.error("Return requests POST error:", error);
    return NextResponse.json({ error: "Failed to submit return request" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { returnRequestId, status, adminNotes } = body;

    if (!returnRequestId || !status) {
      return NextResponse.json({ error: "Return Request ID and Status are required" }, { status: 400 });
    }

    const returnReq = await prisma.returnRequest.findUnique({
      where: { id: returnRequestId },
      include: { order: true, user: true },
    });

    if (!returnReq) {
      return NextResponse.json({ error: "Return request not found" }, { status: 404 });
    }

    const updated = await prisma.returnRequest.update({
      where: { id: returnRequestId },
      data: {
        status: status.toUpperCase(),
        ...(adminNotes && { adminNotes: adminNotes.trim() }),
      },
    });

    // If marked REFUNDED, automatically credit the customer's wallet
    if (status.toUpperCase() === "REFUNDED") {
      const refundAmount = returnReq.order.finalAmount;

      await prisma.user.update({
        where: { id: returnReq.userId },
        data: { walletBalance: { increment: refundAmount } },
      });

      await prisma.order.update({
        where: { id: returnReq.orderId },
        data: {
          status: "REFUNDED",
          paymentStatus: "REFUNDED",
          refundAmount,
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: returnReq.orderId,
          status: "REFUNDED",
          title: "Refund Credited",
          description: `₹${refundAmount.toLocaleString()} has been credited to your BajrangiStore Wallet.`,
        },
      });

      await prisma.notification.create({
        data: {
          userId: returnReq.userId,
          title: "Refund Credited to Wallet 💳",
          message: `Your return for order #${returnReq.order.orderNumber} has been verified and ₹${refundAmount.toLocaleString()} credited to your wallet.`,
          type: "ORDER",
        },
      });
    }

    return NextResponse.json({ success: true, returnRequest: updated });
  } catch (error) {
    console.error("Return requests PATCH error:", error);
    return NextResponse.json({ error: "Failed to update return request" }, { status: 500 });
  }
}
