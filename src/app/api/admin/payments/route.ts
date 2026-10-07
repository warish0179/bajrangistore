import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const method = searchParams.get("method");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (method && method !== "ALL") {
      where.paymentMethod = method;
    }
    if (search) {
      where.OR = [
        { transactionRef: { contains: search } },
        { order: { orderNumber: { contains: search } } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const transactions = await prisma.paymentTransaction.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            finalAmount: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            createdAt: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate analytics metrics
    const allApproved = await prisma.paymentTransaction.findMany({
      where: { status: "APPROVED" },
      select: { amount: true, paymentMethod: true },
    });

    const pendingCount = await prisma.paymentTransaction.count({
      where: { status: "PENDING_VERIFICATION" },
    });

    const totalRevenue = allApproved.reduce((sum, tx) => sum + tx.amount, 0);
    const upiRevenue = allApproved
      .filter((tx) => tx.paymentMethod === "UPI_QR")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const bankRevenue = allApproved
      .filter((tx) => tx.paymentMethod === "BANK_TRANSFER")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const codOrders = await prisma.order.findMany({
      where: { paymentMethod: "COD" },
      select: { finalAmount: true, codCollected: true },
    });
    const codTotalCollected = codOrders
      .filter((o) => o.codCollected)
      .reduce((sum, o) => sum + o.finalAmount, 0);
    const codPendingCollection = codOrders
      .filter((o) => !o.codCollected)
      .reduce((sum, o) => sum + o.finalAmount, 0);

    return NextResponse.json({
      success: true,
      transactions,
      analytics: {
        totalRevenue,
        upiRevenue,
        bankRevenue,
        codTotalCollected,
        codPendingCollection,
        pendingVerificationCount: pendingCount,
        totalTransactionCount: transactions.length,
      },
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
