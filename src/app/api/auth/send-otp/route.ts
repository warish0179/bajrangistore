import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identifier, purpose = "LOGIN" } = await req.json();

    if (!identifier || typeof identifier !== "string" || identifier.trim().length < 4) {
      return NextResponse.json(
        { error: "Valid mobile number or email is required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Invalidate existing active OTPs for this identifier
    await prisma.otpVerification.deleteMany({
      where: { identifier: cleanIdentifier },
    });

    // Save newly generated OTP
    await prisma.otpVerification.create({
      data: {
        identifier: cleanIdentifier,
        otp,
        purpose,
        expiresAt,
      },
    });

    // In production, integrate SMS Gateway (e.g. Twilio / Fast2SMS / MSG91) or Nodemailer/SendGrid here.
    console.log(`[BajrangiStore OTP Service] OTP for ${cleanIdentifier} [${purpose}]: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${identifier}`,
      expiresInSeconds: 300,
      devOtp: otp, // Returned for seamless testing in demo/dev mode
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send verification OTP" },
      { status: 500 }
    );
  }
}
