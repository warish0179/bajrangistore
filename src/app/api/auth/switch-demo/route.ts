import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    const targetEmail =
      role === "ADMIN"
        ? "admin@nexmart.com"
        : role === "SELLER"
        ? "seller@nexmart.com"
        : "customer@nexmart.com";

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { sellerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Demo user not found" }, { status: 404 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CUSTOMER" | "SELLER" | "ADMIN",
      avatar: user.avatar,
      storeSlug: user.sellerProfile?.storeSlug || null,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      token,
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
