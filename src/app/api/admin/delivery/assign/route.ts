import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const workers = await prisma.deliveryProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    const unassignedOrders = await prisma.order.findMany({
      where: {
        status: { in: ["PACKED", "READY_FOR_PICKUP"] },
        deliveryWorkerId: null,
      },
      include: {
        items: true,
        user: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      workers,
      unassignedOrders,
    });
  } catch (error) {
    console.error("Fetch delivery assign data error:", error);
    return NextResponse.json({ error: "Failed to fetch delivery workers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { orderId, deliveryWorkerId } = await req.json();

    if (!orderId || !deliveryWorkerId) {
      return NextResponse.json({ error: "orderId and deliveryWorkerId are required" }, { status: 400 });
    }

    const worker = await prisma.deliveryProfile.findUnique({
      where: { id: deliveryWorkerId },
      include: { user: true },
    });

    if (!worker) {
      return NextResponse.json({ error: "Delivery worker not found" }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryWorkerId,
        status: "ASSIGNED_TO_DELIVERY",
        courierName: `Bajrangi Express (${worker.user.name})`,
      },
      include: { user: true },
    });

    await prisma.deliveryProfile.update({
      where: { id: deliveryWorkerId },
      data: {
        activeDeliveriesCount: { increment: 1 },
      },
    });

    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: "ASSIGNED_TO_DELIVERY",
        title: "Assigned to Delivery Partner",
        description: `Shipment assigned to courier partner ${worker.user.name} (${worker.vehicleType} - ${worker.vehicleNumber || "Verified"}).`,
        location: worker.currentCity || "Bajrangi HyperLogistics Hub",
      },
    });

    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: "Rider Assigned 🛵",
        message: `Your order #${order.orderNumber} has been assigned to ${worker.user.name}. You will be able to verify using your secret Delivery OTP.`,
        type: "DELIVERY",
        link: `/account/orders/${order.orderNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} assigned to ${worker.user.name}`,
      order,
    });
  } catch (error) {
    console.error("Assign delivery worker error:", error);
    return NextResponse.json({ error: "Failed to assign delivery worker" }, { status: 500 });
  }
}
