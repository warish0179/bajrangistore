import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.id },
      include: {
        products: {
          include: {
            images: { take: 1 },
            category: true,
          },
        },
      },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    // Orders that contain this seller's products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId: sellerProfile.id },
          },
        },
      },
      include: {
        items: {
          where: { product: { sellerId: sellerProfile.id } },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    const totalRevenue = orders.reduce((sum, o) => {
      const sellerItemTotal = o.items.reduce((acc, i) => acc + i.total, 0);
      return sum + sellerItemTotal;
    }, 0);

    const lowStockCount = sellerProfile.products.filter((p) => p.stock <= 10).length;

    return NextResponse.json({
      seller: {
        id: sellerProfile.id,
        storeName: sellerProfile.storeName,
        storeSlug: sellerProfile.storeSlug,
        description: sellerProfile.description,
        rating: sellerProfile.rating,
        totalSales: sellerProfile.totalSales,
        logo: sellerProfile.logo,
      },
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: sellerProfile.products.length,
        lowStockCount,
      },
      products: sellerProfile.products,
      orders,
    });
  } catch (error) {
    console.error("Seller stats error:", error);
    return NextResponse.json({ error: "Failed to fetch seller stats" }, { status: 500 });
  }
}
