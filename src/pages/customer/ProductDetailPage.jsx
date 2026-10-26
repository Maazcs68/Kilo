import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Check, MessageSquare } from "lucide-react";
import { getProductById } from "../../services/productService";
import { getProductReviews, createReview } from "../../services/reviewService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewNotice, setReviewNotice] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prod = await getProductById(id);
        setProduct(prod);
        if (prod) {
          const revs = await getProductReviews(id);
          setReviews(revs);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to submit a review.");
      return;
    }
    setSubmittingReview(true);
    setReviewNotice("");
    try {
      await createReview({
        productId: id,
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || "Customer",
        rating: newRating,
        comment: newComment
      });
      setReviewNotice("Review submitted! It will appear once approved by an administrator.");
      setNewComment("");
    } catch (err) {
      setReviewNotice(`Submission failed: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist or is inactive.</p>
        <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImage === idx ? "border-indigo-600 ring-2 ring-indigo-600/20" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {product.categoryName || "Catalog Item"}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {product.brand && <span>Brand: <strong className="text-gray-800">{product.brand}</strong></span>}
              {product.sku && <span>SKU: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{product.sku}</code></span>}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating || 5.0}</span>
            <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-extrabold text-indigo-900">
                  PKR {product.discountPrice.toLocaleString()}
                </span>
                <span className="text-lg line-through text-gray-400">
                  PKR {product.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  Save PKR {(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-indigo-900">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold text-xs">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units left)
              </span>
            ) : (
              <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full font-semibold text-xs">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:bg-gray-300"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition ${
                  inWish ? "bg-pink-50 border-pink-200 text-pink-600" : "border-gray-200 text-gray-600 hover:text-pink-600"
                }`}
                title="Save to Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Flat PKR 200 delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" /> Customer Reviews ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No approved reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-800">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write Review Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 text-base mb-3">Leave a Review</h3>
            {currentUser ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rating (1-5 stars)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Average)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this item..."
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
                >
                  {submittingReview ? "Submitting..." : "Submit Review for Approval"}
                </button>

                {reviewNotice && (
                  <p className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                    {reviewNotice}
                  </p>
                )}
              </form>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500 space-y-2">
                <p>You must be signed in to write a review.</p>
                <Link to="/login" className="inline-block text-xs font-bold text-indigo-600 underline">
                  Sign in here
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
