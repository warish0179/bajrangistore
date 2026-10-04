import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = "CUSTOMER", storeName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === "SELLER" ? "SELLER" : "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
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
          description: `Welcome to ${finalStoreName} on NexMart. We offer certified genuine products and fast dispatch.`,
          rating: 5.0,
          totalSales: 0,
          isApproved: true,
        },
      });
    }

    // Default welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to NexMart! 🎉",
        message: "Your account has been created. Explore our bestsellers and enjoy extra discounts with code NEX50.",
        type: "PROMO",
        link: "/products",
      },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CUSTOMER" | "SELLER" | "ADMIN",
      avatar: user.avatar,
      storeSlug,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
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
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
