import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { createProduct, getProductById, updateProduct } from "../../services/productService";
import { getAllCategoriesAdmin } from "../../services/categoryService";
import { uploadProductImage } from "../../services/storageService";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    categoryName: "",
    brand: "",
    sku: "",
    stock: "10",
    images: [""],
    status: "active",
    featured: false
  });

  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getAllCategoriesAdmin();
        setCategories(cats);

        if (isEditing) {
          const prod = await getProductById(id);
          if (prod) {
            setFormData({
              name: prod.name || "",
              description: prod.description || "",
              price: prod.price !== undefined ? prod.price : "",
              discountPrice: prod.discountPrice !== undefined ? prod.discountPrice : "",
              categoryId: prod.categoryId || "",
              categoryName: prod.categoryName || "",
              brand: prod.brand || "",
              sku: prod.sku || "",
              stock: prod.stock !== undefined ? prod.stock : "0",
              images: prod.images && prod.images.length > 0 ? prod.images : [""],
              status: prod.status || "active",
              featured: Boolean(prod.featured)
            });
          }
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleCategoryChange = (catId) => {
    const found = categories.find((c) => c.id === catId);
    setFormData({
      ...formData,
      categoryId: catId,
      categoryName: found ? found.name : ""
    });
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalImages = formData.images.filter(Boolean);

      // Upload file to Firebase storage if provided
      if (fileToUpload) {
        const tempId = id || `temp_${Date.now()}`;
        try {
          const uploadedUrl = await uploadProductImage(tempId, fileToUpload);
          finalImages = [uploadedUrl, ...finalImages];
        } catch (uploadErr) {
          console.warn("Storage upload error (using placeholder if permission denied):", uploadErr);
        }
      }

      const payload = {
        ...formData,
        images: finalImages.length > 0 ? finalImages : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]
      };

      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Submit error:", err);
      setError(`Failed to save product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. SoundMaster"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Regular Price (PKR)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="5000"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Price (PKR - Optional)</label>
            <input
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              placeholder="3999"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="MSH-WH-001"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Available Stock Units</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full technical details and specifications..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          {/* Image URLs */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Image URLs</label>
            {formData.images.map((img, idx) => (
              <input
                key={idx}
                type="url"
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder="https://example.com/product-image.jpg"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              + Add another image URL
            </button>
          </div>

          {/* Storage File Upload */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Or Upload Image to Firebase Storage (`products/{'{productId}'}/`)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFileToUpload(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="active">Active (Visible to customers)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Mark as Featured Product (Shows on Homepage)
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:bg-gray-400"
          >
            {loading ? "Saving to Firestore..." : isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
