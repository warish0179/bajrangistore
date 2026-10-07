import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { identifier, otp, newPassword } = await req.json();

    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Mobile/Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Verify OTP
    const validOtp = await prisma.otpVerification.findFirst({
      where: {
        identifier: cleanIdentifier,
        otp: otp.toString().trim(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Find User by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { phone: cleanIdentifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this mobile number or email" },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete used OTP
    await prisma.otpVerification.deleteMany({
      where: { identifier: cleanIdentifier },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now login with your new password.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
