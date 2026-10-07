import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.paymentSetting.findFirst();
    if (!settings) {
      settings = await prisma.paymentSetting.create({
        data: {
          id: "default-setting",
          upiId: "9835400188-k322-3@ibl",
          upiQrImage: "/payments/bajrangi_upi_qr.jpg",
          accountHolder: "Warish Raj",
          accountNumber: "000521713102565",
          ifscCode: "JIOP0000001",
          bankName: "Jio Payments Bank",
          paymentInstructions:
            "Scan the PhonePe/Jio Payments QR code or transfer to UPI ID / Bank details. Submit your 12-digit UTR/Reference number for instant automated verification.",
          isUpiActive: true,
          isBankTransferActive: true,
          isCodActive: true,
          isWalletActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Fetch payment settings error:", error);
    return NextResponse.json({ error: "Failed to fetch payment settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      upiId,
      upiQrImage,
      accountHolder,
      accountNumber,
      ifscCode,
      bankName,
      paymentInstructions,
      isUpiActive,
      isBankTransferActive,
      isCodActive,
      isWalletActive,
    } = body;

    const updated = await prisma.paymentSetting.upsert({
      where: { id: "default-setting" },
      update: {
        upiId,
        upiQrImage,
        accountHolder,
        accountNumber,
        ifscCode,
        bankName,
        paymentInstructions,
        isUpiActive,
        isBankTransferActive,
        isCodActive,
        isWalletActive,
      },
      create: {
        id: "default-setting",
        upiId: upiId || "9835400188-k322-3@ibl",
        upiQrImage: upiQrImage || "/payments/bajrangi_upi_qr.jpg",
        accountHolder: accountHolder || "Warish Raj",
        accountNumber: accountNumber || "000521713102565",
        ifscCode: ifscCode || "JIOP0000001",
        bankName: bankName || "Jio Payments Bank",
        paymentInstructions: paymentInstructions || "Submit 12-digit UTR for verification.",
        isUpiActive: isUpiActive !== undefined ? isUpiActive : true,
        isBankTransferActive: isBankTransferActive !== undefined ? isBankTransferActive : true,
        isCodActive: isCodActive !== undefined ? isCodActive : true,
        isWalletActive: isWalletActive !== undefined ? isWalletActive : true,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update payment settings error:", error);
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 });
  }
}
