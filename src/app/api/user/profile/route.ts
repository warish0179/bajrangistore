import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        panNumber: true,
        avatar: true,
        walletBalance: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, gender, dob, panNumber, avatar } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        gender: gender || null,
        dob: dob || null,
        panNumber: panNumber ? panNumber.toUpperCase().trim() : null,
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        panNumber: true,
        avatar: true,
        walletBalance: true,
        role: true,
        createdAt: true,
      },
    });

    // Re-issue JWT session cookie with updated name & avatar
    const updatedSession = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role as any,
      avatar: updatedUser.avatar,
      storeSlug: session.storeSlug,
      walletBalance: updatedUser.walletBalance,
    };

    const token = signToken(updatedSession);

    const response = NextResponse.json({
      success: true,
      message: "Profile details updated successfully!",
      user: updatedUser,
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
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
