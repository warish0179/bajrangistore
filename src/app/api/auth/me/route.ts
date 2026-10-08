import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        sellerProfile: true,
        deliveryProfile: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 200, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(
      {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          avatar: dbUser.avatar,
          storeSlug: dbUser.sellerProfile?.storeSlug || null,
          walletBalance: dbUser.walletBalance || 0,
        },
      },
      {
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
