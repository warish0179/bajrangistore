"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Share2,
  Store,
  Check,
  ThumbsUp,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ProductCard } from "@/components/products/ProductCard";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addRecentProduct } = useRecentlyViewed();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User selections
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("560038");
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch product
  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }

        // Add to recently viewed
        addRecentProduct({
          id: data.product.id,
          title: data.product.title,
          slug: data.product.slug,
          salePrice: data.product.salePrice,
          basePrice: data.product.basePrice,
          discountPercent: data.product.discountPercent,
          rating: data.product.rating,
          imageUrl: data.product.images?.[0]?.url || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link href="/products" className="text-xs font-bold text-brand-600">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const images = product.images || [];
  const currentImage = images[selectedImageIdx]?.url || images[0]?.url || "";
  const currentPrice = selectedVariant ? selectedVariant.salePrice : product.salePrice;
  const currentBasePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try {
      specsObj = JSON.parse(product.specs);
    } catch {}
  }

  let highlightsList: string[] = [];
  if (product.highlights) {
    try {
      highlightsList = JSON.parse(product.highlights);
    } catch {}
  }

  const handleAddToCart = async () => {
    await addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product, selectedVariant, quantity);
    router.push("/cart");
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please sign in to write a review", "info");
      router.push("/auth/login");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        showToast("Review submitted successfully! Thank you for your feedback.", "success");
        setIsReviewModalOpen(false);
        setReviewTitle("");
        setReviewComment("");
        fetchProduct();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to submit review", "error");
      }
    } catch {
      showToast("Error submitting review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] scrollbar-none">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImageIdx === idx
                      ? "border-brand-600 shadow-md ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Zoomable Image Frame */}
          <div className="flex-1 relative pt-[100%] rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm group">
            {product.isFlashDeal && (
              <span className="absolute top-4 left-4 z-10 bg-rose-600 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Zap className="w-3.5 h-3.5 fill-white" /> FLASH DEAL
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="absolute top-4 right-4 z-10 bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                {product.discountPercent}% OFF
              </span>
            )}

            <img
              src={currentImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
              }}
            />
          </div>
        </div>

        {/* Center Column: Details & Specs (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
              Brand: {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mt-1">
              {product.title}
            </h1>
          </div>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-200">
              <span>{product.rating}</span>
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            </div>
            <a href="#reviews" className="text-xs text-brand-600 hover:underline font-medium">
              {product.reviewCount} customer reviews
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">100% Verified Quality</span>
          </div>

          {/* Pricing Box */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {currentBasePrice > currentPrice && (
                <span className="text-sm text-slate-400 mrp-strike">
                  {formatCurrency(currentBasePrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">Inclusive of all taxes. Free shipping on this item.</div>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800">
                Select Option / Configuration:
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-brand-600 bg-brand-50 text-brand-700 shadow-xs ring-1 ring-brand-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key highlights */}
          {highlightsList.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {highlightsList.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pincode & Delivery Checker */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Truck className="w-4 h-4 text-brand-600" /> Delivery Availability
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Pincode"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-brand-600 bg-white"
              />
              <button
                onClick={() => setPincodeChecked(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors"
              >
                Check
              </button>
            </div>
            {pincodeChecked && (
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Deliverable to {pincode} — Free Express by Tomorrow
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Buy Box & Seller Info (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
          {/* Stock state */}
          <div>
            {currentStock > 10 ? (
              <div className="text-emerald-600 font-extrabold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> In Stock
              </div>
            ) : currentStock > 0 ? (
              <div className="text-amber-600 font-extrabold text-xs">
                Only {currentStock} left in stock - order soon!
              </div>
            ) : (
              <div className="text-rose-600 font-extrabold text-sm">Temporarily Out of Stock</div>
            )}
            <div className="text-[11px] text-slate-500 mt-0.5">
              Fulfilled by <span className="font-semibold text-slate-800">BajrangiStore Express</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                -
              </button>
              <span className="px-3 py-1 text-slate-900 font-bold text-xs">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist button */}
          <button
            onClick={() =>
              toggleWishlist({
                id: product.id,
                title: product.title,
                slug: product.slug,
                basePrice: product.basePrice,
                salePrice: product.salePrice,
                discountPercent: product.discountPercent,
                rating: product.rating,
                reviewCount: product.reviewCount,
                stock: product.stock,
                images: product.images,
              })
            }
            className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              isFavorited
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFavorited ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>

          {/* Guarantees */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit Secure Transaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>7-Day Hassle-Free Doorstep Replacement</span>
            </div>
          </div>

          {/* Seller Store Card */}
          {product.seller && (
            <div className="border-t border-slate-100 pt-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                Sold By Merchant
              </div>
              <Link
                href={`/sellers/${product.seller.storeSlug}`}
                className="flex items-center justify-between group p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-brand-600">
                    {product.seller.storeName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {product.seller.totalSales} items sold • {product.seller.rating}★ Store Rating
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Technical Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200">
        <div className="lg:col-span-8 space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Product Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </section>

          {/* Specifications Table */}
          {Object.keys(specsObj).length > 0 && (
            <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Technical Specifications
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {Object.entries(specsObj).map(([key, val], idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-3 p-3 text-xs ${
                      idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                    }`}
                  >
                    <span className="font-bold text-slate-700">{key}</span>
                    <span className="col-span-2 text-slate-600">{val}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Customer Reviews Section */}
          <section id="reviews" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Customer Ratings & Reviews</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified feedback from real purchasers
                </p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <MessageSquarePlus className="w-4 h-4" /> Write a Review
              </button>
            </div>

            {/* Ratings Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="sm:col-span-4 text-center sm:border-r border-slate-200 sm:pr-4">
                <div className="text-4xl font-black text-slate-900">{product.rating}</div>
                <div className="flex justify-center gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500">Based on {product.reviewCount} reviews</div>
              </div>

              <div className="sm:col-span-8 space-y-1.5 text-xs">
                {[
                  { star: 5, pct: 82 },
                  { star: 4, pct: 12 },
                  { star: 3, pct: 4 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 1 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3">
                    <span className="w-8 font-bold text-slate-600">{row.star}★</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-medium">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-4 pt-2">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-800">{rev.user?.name}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-900 ml-1.5">{rev.title}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Related Products */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Related Products in Category</h3>
          <div className="space-y-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Write a Customer Review</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setReviewRating(s)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          s <= reviewRating
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-300 hover:text-amber-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent build quality, totally worth it!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-brand-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did you like or dislike? How does it perform?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-brand-600 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
