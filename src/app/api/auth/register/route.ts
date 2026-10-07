import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      password,
      dob,
      referralCode,
      otp,
      role = "CUSTOMER",
      storeName,
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : null;

    // Verify OTP if provided (recommended for registration)
    if (otp) {
      const identifier = (cleanPhone || normalizedEmail).toLowerCase();
      const validOtp = await prisma.otpVerification.findFirst({
        where: {
          identifier,
          otp: otp.toString().trim(),
          expiresAt: { gt: new Date() },
        },
      });

      if (!validOtp) {
        return NextResponse.json(
          { error: "Invalid or expired OTP verification code" },
          { status: 400 }
        );
      }

      // Cleanup
      await prisma.otpVerification.deleteMany({
        where: { identifier },
      });
    }

    // Check if email already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or mobile number already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === "SELLER" ? "SELLER" : "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: cleanPhone,
        dob: dob || null,
        referralCode: referralCode || null,
        passwordHash,
        role: assignedRole,
        walletBalance: 500.0, // ₹500 Welcome Wallet credit!
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      },
    });

    let storeSlug = null;
    if (assignedRole === "SELLER") {
      const finalStoreName = storeName || `${name}'s Store`;
      const baseSlug = slugify(finalStoreName);
      storeSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          storeName: finalStoreName,
          storeSlug,
          description: `Welcome to ${finalStoreName} on BajrangiStore. We offer certified genuine products and fast dispatch.`,
          rating: 5.0,
          totalSales: 0,
          isApproved: true,
          status: "APPROVED",
        },
      });
    }

    // Default welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to BajrangiStore! 🎉",
        message: "Your account has been created. A ₹500 welcome bonus has been credited to your BajrangiStore Wallet!",
        type: "PROMO",
      },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER",
      avatar: user.avatar,
      storeSlug,
      walletBalance: user.walletBalance,
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

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
