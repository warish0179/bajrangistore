import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify, calculateDiscountPercent } from "@/lib/format";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const categorySlug = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "99999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const inStock = searchParams.get("inStock") === "true";
    const isDeal = searchParams.get("isDeal") === "true";
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12"));

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (brand && brand !== "all") {
      const brandList = brand.split(",").map((b) => b.trim());
      where.brand = { in: brandList };
    }

    where.salePrice = {
      gte: minPrice,
      lte: maxPrice,
    };

    if (minRating > 0) {
      where.rating = { gte: minRating };
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    if (isDeal) {
      where.OR = [{ isDealOfTheDay: true }, { isFlashDeal: true }];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { salePrice: "asc" };
    else if (sort === "price_desc") orderBy = { salePrice: "desc" };
    else if (sort === "rating_desc") orderBy = { rating: "desc" };
    else if (sort === "discount_desc") orderBy = { discountPercent: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        seller: {
          select: { storeName: true, storeSlug: true, rating: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Available brands for filter sidebar
    const brandsAgg = await prisma.product.groupBy({
      by: ["brand"],
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: 15,
    });

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      availableBrands: brandsAgg.map((b) => ({ name: b.brand, count: b._count.brand })),
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      brand,
      categoryId,
      basePrice,
      salePrice,
      stock = 25,
      images = [],
      variants = [],
      tags = "",
      specs = {},
      highlights = [],
      isFeatured = false,
      isDealOfTheDay = false,
      isFlashDeal = false,
    } = body;

    if (!title || !categoryId || !basePrice || !salePrice) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;
    const discountPercent = calculateDiscountPercent(basePrice, salePrice);

    let sellerId = null;
    if (session.role === "SELLER") {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.id },
      });
      sellerId = sellerProfile?.id || null;
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || title,
        brand: brand || "Generic",
        categoryId,
        sellerId,
        basePrice: parseFloat(basePrice),
        salePrice: parseFloat(salePrice),
        discountPercent,
        stock: parseInt(stock, 10),
        tags,
        specs: typeof specs === "string" ? specs : JSON.stringify(specs),
        highlights: typeof highlights === "string" ? highlights : JSON.stringify(highlights),
        isFeatured: !!isFeatured,
        isDealOfTheDay: !!isDealOfTheDay,
        isFlashDeal: !!isFlashDeal,
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === "string" ? img : img.url,
            isPrimary: idx === 0,
            sortOrder: idx,
            alt: title,
          })),
        },
        variants: {
          create: variants.map((v: any, idx: number) => ({
            name: v.name,
            sku: v.sku || `${slug.toUpperCase().slice(0, 8)}-V${idx + 1}`,
            price: parseFloat(v.price || basePrice),
            salePrice: parseFloat(v.salePrice || salePrice),
            stock: parseInt(v.stock || stock, 10),
            attributes: typeof v.attributes === "string" ? v.attributes : JSON.stringify(v.attributes || {}),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
