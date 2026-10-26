import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Search, PackageCheck } from "lucide-react";
import { getAllProductsAdmin, deleteProduct } from "../../services/productService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      console.error("Error loading admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Deletion error: ${err.message}`);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all store inventory, prices, and specifications</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No products found. Click "Add New Product" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&q=80"}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-gray-400">{prod.brand || "No brand"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">{prod.sku || "-"}</td>
                    <td className="px-6 py-4">{prod.categoryName || "-"}</td>
                    <td className="px-6 py-4">
                      {prod.discountPrice ? (
                        <div>
                          <span className="font-bold text-gray-900">PKR {prod.discountPrice.toLocaleString()}</span>
                          <span className="block text-[10px] line-through text-gray-400">PKR {prod.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">PKR {prod.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${prod.stock <= 5 ? "text-amber-600" : "text-gray-900"}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          prod.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
