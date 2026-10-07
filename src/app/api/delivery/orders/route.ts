import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "DELIVERY_WORKER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Delivery worker access required." }, { status: 403 });
    }

    // Find the delivery profile
    const deliveryProfile = await prisma.deliveryProfile.findUnique({
      where: { userId: session.id },
    });

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "active"; // active, completed, all

    let statusCondition: any = {};
    if (filter === "active") {
      statusCondition = { in: ["PACKED", "READY_FOR_PICKUP", "ASSIGNED_TO_DELIVERY", "PICKED_UP", "OUT_FOR_DELIVERY"] };
    } else if (filter === "completed") {
      statusCondition = { in: ["DELIVERED", "CANCELLED"] };
    }

    const whereClause: any = {};
    if (session.role === "DELIVERY_WORKER") {
      // If worker has profile, filter by worker id; otherwise find any assigned or unassigned ready orders
      if (deliveryProfile) {
        whereClause.OR = [
          { deliveryWorkerId: deliveryProfile.id },
          { deliveryWorkerId: null, status: { in: ["READY_FOR_PICKUP", "PACKED"] } }
        ];
      }
    }

    if (filter !== "all") {
      whereClause.status = statusCondition;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        timeline: {
          orderBy: { timestamp: "desc" },
          take: 3,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders,
      workerProfile: deliveryProfile,
    });
  } catch (error) {
    console.error("Delivery orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch delivery orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "DELIVERY_WORKER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Delivery worker access required." }, { status: 403 });
    }

    const deliveryProfile = await prisma.deliveryProfile.findUnique({
      where: { userId: session.id },
    });

    const body = await req.json();
    const { orderId, newStatus, enteredOtp, codCollected, proofNote, proofPhoto } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "Order ID and newStatus are required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handshake OTP verification for DELIVERED status
    if (newStatus === "DELIVERED") {
      if (order.deliveryOtp && order.deliveryOtp.trim() !== "") {
        if (!enteredOtp || enteredOtp.trim() !== order.deliveryOtp.trim()) {
          return NextResponse.json(
            { error: "Invalid Delivery OTP! Ask customer to read the 4-digit OTP shown in their tracking screen." },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (deliveryProfile && !order.deliveryWorkerId) {
      updateData.deliveryWorkerId = deliveryProfile.id;
    }

    if (newStatus === "DELIVERED") {
      updateData.deliveryProofNote = proofNote || "Delivered directly to recipient.";
      if (proofPhoto) updateData.deliveryProofPhoto = proofPhoto;

      if (order.paymentMethod === "COD") {
        updateData.codCollected = Boolean(codCollected);
        updateData.paymentStatus = "PAID";
      }

      // Update worker profile earnings
      if (deliveryProfile) {
        await prisma.deliveryProfile.update({
          where: { id: deliveryProfile.id },
          data: {
            completedDeliveriesCount: { increment: 1 },
            activeDeliveriesCount: { decrement: 1 },
            totalEarnings: { increment: 65 }, // ₹65 per successful delivery incentive
          },
        });
      }
    } else if (newStatus === "PICKED_UP") {
      if (deliveryProfile) {
        await prisma.deliveryProfile.update({
          where: { id: deliveryProfile.id },
          data: {
            activeDeliveriesCount: { increment: 1 },
          },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Create Order Timeline Entry
    const timelineTitles: Record<string, string> = {
      PICKED_UP: "Package Picked Up by Courier Partner",
      OUT_FOR_DELIVERY: "Rider Out For Delivery",
      DELIVERED: "Package Delivered Successfully 📦",
      FAILED_DELIVERY: "Delivery Attempt Failed - Rescheduling",
    };

    const timelineDescs: Record<string, string> = {
      PICKED_UP: `Rider ${session.name} has picked up the shipment and is heading to the delivery zone.`,
      OUT_FOR_DELIVERY: `Rider ${session.name} is arriving shortly with your package. Keep OTP ${order.deliveryOtp || ""} ready.`,
      DELIVERED: `Package handed over to recipient. Verified via secure doorstep OTP. Note: ${proofNote || "Complete"}.`,
      FAILED_DELIVERY: "Recipient was unavailable or requested rescheduling. Re-attempt will occur tomorrow.",
    };

    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: newStatus,
        title: timelineTitles[newStatus] || `Status updated to ${newStatus}`,
        description: timelineDescs[newStatus] || `Package status updated by rider.`,
        location: deliveryProfile?.currentCity || "Bajrangi HyperLogistics Hub",
      },
    });

    // Notify Customer
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: timelineTitles[newStatus] || `Order #${order.orderNumber} update`,
        message: timelineDescs[newStatus] || `Your order status changed to ${newStatus}.`,
        type: "DELIVERY",
        link: `/account/orders/${order.orderNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} marked as ${newStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Delivery status update error:", error);
    return NextResponse.json({ error: "Failed to update delivery status" }, { status: 500 });
  }
}
