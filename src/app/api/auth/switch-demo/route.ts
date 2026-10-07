import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    let targetEmail = "customer@bajrangistore.com";
    if (role === "ADMIN") {
      targetEmail = "admin@bajrangistore.com";
    } else if (role === "SELLER") {
      targetEmail = "seller@bajrangistore.com";
    } else if (role === "DELIVERY_WORKER") {
      targetEmail = "delivery@bajrangistore.com";
    }

    let user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { sellerProfile: true, deliveryProfile: true },
    });

    if (!user) {
      // Fallback search by role
      user = await prisma.user.findFirst({
        where: { role },
        include: { sellerProfile: true, deliveryProfile: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: `Demo user for role ${role} not found` }, { status: 404 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER",
      avatar: user.avatar,
      storeSlug: user.sellerProfile?.storeSlug || null,
      walletBalance: user.walletBalance || 0,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      token,
    });

    response.cookies.set("bajrangi_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("nexmart_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Switch demo error:", error);
    return NextResponse.json({ error: "Failed to switch role" }, { status: 500 });
  }
}
