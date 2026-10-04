import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: { slug: true, brand: true },
            },
          },
        },
        timeline: {
          orderBy: { timestamp: "asc" },
        },
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.role === "CUSTOMER" && order.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await params;
    const body = await req.json();
    const { action, status, cancelReason, returnReason, courierName, trackingNumber, location } = body;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Customer cancellation
    if (action === "CANCEL") {
      if (order.status !== "PENDING" && order.status !== "CONFIRMED" && order.status !== "PROCESSING") {
        return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 });
      }

      const updated = await prisma.order.update({
        where: { orderNumber },
        data: {
          status: "CANCELLED",
          cancelReason: cancelReason || "Customer requested cancellation",
          paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED",
          refundAmount: order.paymentStatus === "PAID" ? order.finalAmount : 0,
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
          title: "Order Cancelled",
          description: cancelReason || "Cancelled by customer. Refund initiated.",
          location: "Customer Care",
        },
      });

      return NextResponse.json({ success: true, order: updated });
    }

    // Customer return request
    if (action === "RETURN") {
      if (order.status !== "DELIVERED") {
        return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
      }

      const updated = await prisma.order.update({
        where: { orderNumber },
        data: {
          status: "RETURN_REQUESTED",
          returnReason: returnReason || "Defective or unsatisfied item",
        },
      });

      await prisma.orderTimeline.create({
        data: {
          orderId: order.id,
          status: "RETURN_REQUESTED",
          title: "Return Pickup Requested",
          description: returnReason || "Return request submitted. Courier agent will visit for inspection.",
          location: "NexMart Reverse Logistics",
        },
      });

      return NextResponse.json({ success: true, order: updated });
    }

    // Admin or Seller updating status
    if (status && (session.role === "ADMIN" || session.role === "SELLER")) {
      const updated = await prisma.order.update({
        where: { orderNumber },
        data: {
          status,
          courierName: courierName || order.courierName,
          trackingNumber: trackingNumber || order.trackingNumber,
          paymentStatus: status === "DELIVERED" ? "PAID" : order.paymentStatus,
        },
      });

      const titleMap: Record<string, string> = {
        CONFIRMED: "Order Confirmed",
        PROCESSING: "Items Packed & Manifest Created",
        SHIPPED: `Dispatched via ${courierName || order.courierName || "Express Courier"}`,
        OUT_FOR_DELIVERY: "Courier Executive is Out for Delivery",
        DELIVERED: "Package Delivered to Customer",
        CANCELLED: "Order Cancelled",
      };

      await prisma.orderTimeline.create({
        data: {
          orderId: order.id,
          status,
          title: titleMap[status] || `Status updated to ${status}`,
          description: `Tracking ID: ${trackingNumber || order.trackingNumber || "N/A"}`,
          location: location || "Fulfillment Hub",
        },
      });

      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
