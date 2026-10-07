import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: "Identifier and 6-digit OTP are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const record = await prisma.otpVerification.findFirst({
      where: {
        identifier: cleanIdentifier,
        otp: cleanOtp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Keep record or consume it based on purpose
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
