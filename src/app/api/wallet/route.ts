import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { walletBalance: true, name: true, email: true },
    });

    const transactions = await prisma.paymentTransaction.findMany({
      where: { userId: session.id },
      include: {
        order: {
          select: { orderNumber: true, totalAmount: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      walletBalance: user?.walletBalance || 0,
      transactions,
    });
  } catch (error) {
    console.error("Wallet GET error:", error);
    return NextResponse.json({ error: "Failed to fetch wallet details" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Please enter a valid top-up amount" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { walletBalance: { increment: numAmount } },
    });

    await prisma.notification.create({
      data: {
        userId: session.id,
        title: "Wallet Topped Up! 💳",
        message: `₹${numAmount.toLocaleString()} added to your BajrangiStore Wallet. Current balance: ₹${updatedUser.walletBalance.toLocaleString()}`,
        type: "PROMO",
      },
    });

    return NextResponse.json({
      success: true,
      message: `₹${numAmount.toLocaleString()} added to wallet!`,
      walletBalance: updatedUser.walletBalance,
    });
  } catch (error) {
    console.error("Wallet POST error:", error);
    return NextResponse.json({ error: "Failed to top up wallet" }, { status: 500 });
  }
}
