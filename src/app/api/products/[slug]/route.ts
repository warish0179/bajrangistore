import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            description: true,
            rating: true,
            totalSales: true,
            logo: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        images: true,
      },
      take: 4,
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { seller: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (session.role === "SELLER" && existingProduct.seller?.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: Not your product" }, { status: 403 });
    }

    const updated = await prisma.product.update({
      where: { slug },
      data: {
        title: body.title !== undefined ? body.title : existingProduct.title,
        description: body.description !== undefined ? body.description : existingProduct.description,
        basePrice: body.basePrice !== undefined ? parseFloat(body.basePrice) : existingProduct.basePrice,
        salePrice: body.salePrice !== undefined ? parseFloat(body.salePrice) : existingProduct.salePrice,
        stock: body.stock !== undefined ? parseInt(body.stock) : existingProduct.stock,
        isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : existingProduct.isFeatured,
        isDealOfTheDay: body.isDealOfTheDay !== undefined ? !!body.isDealOfTheDay : existingProduct.isDealOfTheDay,
        isFlashDeal: body.isFlashDeal !== undefined ? !!body.isFlashDeal : existingProduct.isFlashDeal,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (session.role === "SELLER" && product.seller?.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { slug } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
