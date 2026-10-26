import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, Heart, ShoppingBag, Database } from "lucide-react";
import { getProducts } from "../../services/productService";
import { getActiveCategories } from "../../services/categoryService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { seedInitialStoreData } from "../../utils/seedData";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState("");

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        getActiveCategories(),
        getProducts({ status: "active", featured: true, limitCount: 8 })
      ]);
      setCategories(cats);
      setFeaturedProducts(prods);
    } catch (err) {
      console.warn("Could not fetch Firestore data directly (maybe empty or rules):", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedInitialStoreData();
      setSeedNotice("Sample catalog loaded successfully into Firestore!");
      await loadData();
    } catch (err) {
      setSeedNotice(`Seed failed: ${err.message}. Make sure Firestore rules allow writes or you are authenticated.`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Welcome to Meshoo Online Store
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Premium Shopping <br />
              <span className="bg-gradient-to-r from-pink-400 via-yellow-200 to-indigo-200 bg-clip-text text-transparent">
                Everyday Value.
              </span>
            </h1>
            <p className="text-lg text-indigo-100/90 leading-relaxed">
              Explore authentic electronics, stylish fashion, and trending essentials with fast delivery across Pakistan. Cash on Delivery supported.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition shadow-lg shadow-indigo-950/20"
              >
                Shop Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              {categories.length === 0 && !loading && (
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600/60 border border-indigo-400/40 text-white font-medium hover:bg-indigo-600 transition"
                >
                  <Database className="w-4 h-4" />
                  {seeding ? "Populating Data..." : "Seed Demo Products to Firestore"}
                </button>
              )}
            </div>
            {seedNotice && (
              <p className="text-xs text-yellow-300 bg-black/30 p-2.5 rounded-lg border border-yellow-400/30">
                {seedNotice}
              </p>
            )}
          </div>

          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-200 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Firebase Backend Connected
            </h3>
            <div className="space-y-2 text-xs font-mono text-indigo-100">
              <p><span className="text-indigo-300">Project:</span> web-application-ad62e</p>
              <p><span className="text-indigo-300">Auth:</span> Customer & Admin</p>
              <p><span className="text-indigo-300">Database:</span> Cloud Firestore</p>
              <p><span className="text-indigo-300">Storage:</span> Firebase Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Fast Islandwide Delivery</h4>
              <p className="text-xs text-gray-500">Standard PKR 200 flat shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Cash on Delivery (COD)</h4>
              <p className="text-xs text-gray-500">Inspect & pay on your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">7-Day Return Guarantee</h4>
              <p className="text-xs text-gray-500">Hassle-free replacement policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            <p className="text-sm text-gray-500">Browse your favorite departments</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition aspect-square flex flex-col justify-end p-5 text-white"
            >
              <img
                src={cat.image || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80"}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-xs text-gray-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
            <p className="text-sm text-gray-500">Handpicked popular items</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            Explore More &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => {
              const inWish = isInWishlist(prod.id);
              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={prod.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition ${
                        inWish ? "bg-pink-50 text-pink-600" : "bg-white/80 text-gray-500 hover:text-pink-600"
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    {prod.discountPrice && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Sale
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      {prod.categoryName || "General"}
                    </span>
                    <Link
                      to={`/product/${prod.id}`}
                      className="font-bold text-gray-900 text-sm hover:text-indigo-600 line-clamp-2 transition mb-2"
                    >
                      {prod.name}
                    </Link>

                    <div className="flex items-center gap-1 text-xs text-amber-500 mb-3">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold">{prod.rating || 5.0}</span>
                      <span className="text-gray-400">({prod.reviewCount || 0})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                      <div>
                        {prod.discountPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-base text-gray-900">
                              PKR {prod.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-xs line-through text-gray-400">
                              PKR {prod.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-extrabold text-base text-gray-900">
                            PKR {prod.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
