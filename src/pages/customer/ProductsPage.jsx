import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, Star, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../../services/productService";
import { getActiveCategories } from "../../services/categoryService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getActiveCategories(),
          getProducts({
            categoryId: selectedCat === "all" ? null : selectedCat,
            status: "active",
            limitCount: 100
          })
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCat]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Explore Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse our wide selection of authentic quality products.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, brand, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCat === "all"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.id })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCat === cat.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-gray-500 text-base">No products found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
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
                  <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                    <span>{prod.categoryName || "General"}</span>
                    {prod.brand && <span className="text-gray-400 font-normal">{prod.brand}</span>}
                  </div>

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
    </div>
  );
}
