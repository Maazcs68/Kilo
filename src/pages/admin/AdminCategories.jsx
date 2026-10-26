import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Layers } from "lucide-react";
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../services/categoryService";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: "active"
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({ name: "", description: "", image: "", status: "active" });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      status: cat.status || "active"
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, formData);
      } else {
        await createCategory(formData);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-xs text-gray-500 mt-1">Organize products into customer catalog sections</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-sm text-gray-500 bg-white rounded-2xl border border-gray-200">
            No categories yet. Click "Add Category" to create one.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="h-36 bg-gray-100 relative overflow-hidden">
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80"}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cat.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-mono text-gray-400 text-[10px]">ID: {cat.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-gray-900">
              {editingCat ? "Edit Category" : "New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Footwear"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category overview..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
