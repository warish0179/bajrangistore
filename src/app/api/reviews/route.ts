import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to leave a review" }, { status: 401 });
    }

    const { productId, rating, title, comment, images } = await req.json();

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ error: "Rating, title and comment are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.id,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title,
        comment,
        images: images ? JSON.stringify(images) : null,
        verifiedPurchase: true,
      },
    });

    // Recompute product average rating and count
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? parseFloat((totalRatings / allReviews.length).toFixed(1)) : 5.0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
