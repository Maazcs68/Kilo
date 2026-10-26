import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Layers, ShoppingBag, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";
import { getAllProductsAdmin } from "../../services/productService";
import { getAllCategoriesAdmin } from "../../services/categoryService";
import { getAllOrdersAdmin } from "../../services/orderService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [prods, cats, ords] = await Promise.all([
          getAllProductsAdmin(),
          getAllCategoriesAdmin(),
          getAllOrdersAdmin()
        ]);

        const revenue = ords.reduce((acc, curr) => acc + (curr.total || 0), 0);
        // Sort recent orders
        const sortedOrders = [...ords].sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setStats({
          productsCount: prods.length,
          categoriesCount: cats.length,
          ordersCount: ords.length,
          totalRevenue: revenue,
          recentOrders: sortedOrders.slice(0, 5)
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { title: "Total Orders", value: stats.ordersCount, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { title: "Active Products", value: stats.productsCount, icon: Package, color: "text-purple-600 bg-purple-50" },
    { title: "Categories", value: stats.categoriesCount, icon: Layers, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time e-commerce operational performance</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">{card.title}</p>
                <p className="text-2xl font-black text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900">{ord.id}</td>
                    <td className="px-6 py-4">{ord.customerName}</td>
                    <td className="px-6 py-4">{ord.items?.length || 0} item(s)</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      PKR {ord.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        {ord.orderStatus}
                      </span>
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
