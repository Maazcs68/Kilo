import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../services/productService";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      setLoading(true);
      try {
        const prods = await Promise.all(
          wishlistIds.map((id) => getProductById(id))
        );
        setProducts(prods.filter(Boolean));
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-500 mt-1">
          Keep track of items you love and add them to your cart anytime.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Your wishlist is empty</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Browse our catalog and tap the heart icon on any item you want to save.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={prod.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-red-500 hover:bg-white transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase mb-1">
                  {prod.categoryName || "General"}
                </span>
                <Link
                  to={`/product/${prod.id}`}
                  className="font-bold text-gray-900 text-sm hover:text-indigo-600 line-clamp-2 transition mb-2"
                >
                  {prod.name}
                </Link>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="font-extrabold text-base text-gray-900">
                    PKR {(prod.discountPrice || prod.price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
