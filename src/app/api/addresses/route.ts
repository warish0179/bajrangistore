import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      houseNumber,
      street,
      area,
      landmark,
      city,
      state,
      postalCode,
      type = "HOME",
      isDefault = false,
    } = body;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: "Full Name, Mobile Number, Street, City, State, and PIN Code are required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      });
    }

    const addressCount = await prisma.address.count({ where: { userId: session.id } });
    const markDefault = isDefault || addressCount === 0;

    const address = await prisma.address.create({
      data: {
        userId: session.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        houseNumber: houseNumber?.trim() || null,
        street: street.trim(),
        area: area?.trim() || null,
        landmark: landmark?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: "India",
        type: type.toUpperCase(),
        isDefault: markDefault,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Addresses POST error:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      fullName,
      phone,
      houseNumber,
      street,
      area,
      landmark,
      city,
      state,
      postalCode,
      type,
      isDefault,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id, userId: session.id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(houseNumber !== undefined && { houseNumber: houseNumber ? houseNumber.trim() : null }),
        ...(street && { street: street.trim() }),
        ...(area !== undefined && { area: area ? area.trim() : null }),
        ...(landmark !== undefined && { landmark: landmark ? landmark.trim() : null }),
        ...(city && { city: city.trim() }),
        ...(state && { state: state.trim() }),
        ...(postalCode && { postalCode: postalCode.trim() }),
        ...(type && { type: type.toUpperCase() }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error("Addresses PUT error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    await prisma.address.delete({
      where: { id, userId: session.id },
    });

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error("Addresses DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
