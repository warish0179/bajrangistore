import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalOrders,
      totalUsers,
      totalSellers,
      totalProducts,
      lowStockProducts,
      orders,
      categories,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.sellerProfile.count(),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { paymentStatus: "PAID" },
    });

    // Mock weekly revenue graph data for visualization
    const salesData = [
      { name: "Mon", revenue: 84000, orders: 18 },
      { name: "Tue", revenue: 96000, orders: 24 },
      { name: "Wed", revenue: 142000, orders: 32 },
      { name: "Thu", revenue: 115000, orders: 28 },
      { name: "Fri", revenue: 189000, orders: 46 },
      { name: "Sat", revenue: 245000, orders: 62 },
      { name: "Sun", revenue: 210000, orders: 55 },
    ];

    const categoryData = categories.map((cat) => ({
      name: cat.name,
      count: cat._count.products,
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        totalOrders,
        totalUsers,
        totalSellers,
        totalProducts,
        lowStockProducts,
      },
      recentOrders: orders,
      salesData,
      categoryData,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin statistics" }, { status: 500 });
  }
}
