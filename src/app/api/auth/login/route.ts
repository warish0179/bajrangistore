import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.emailOrPhone || body.email || body.phone || "").trim().toLowerCase();
    const { password, otp, isOtpLogin } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Mobile number or email address is required" },
        { status: 400 }
      );
    }

    // Find User by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          // Also match without country code or with spaces
          { phone: identifier.replace(/[\s-]/g, "") },
        ],
      },
      include: { sellerProfile: true, deliveryProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No BajrangiStore account found for this mobile number or email" },
        { status: 401 }
      );
    }

    if (isOtpLogin) {
      if (!otp) {
        return NextResponse.json(
          { error: "6-digit OTP is required for OTP sign-in" },
          { status: 400 }
        );
      }

      const validOtp = await prisma.otpVerification.findFirst({
        where: {
          identifier: identifier,
          otp: otp.toString().trim(),
          expiresAt: { gt: new Date() },
        },
      });

      if (!validOtp) {
        return NextResponse.json(
          { error: "Invalid or expired OTP. Please try again." },
          { status: 400 }
        );
      }

      // Cleanup used OTP
      await prisma.otpVerification.deleteMany({
        where: { identifier: identifier },
      });
    } else {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required" },
          { status: 400 }
        );
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password. Please verify your credentials." },
          { status: 401 }
        );
      }
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
