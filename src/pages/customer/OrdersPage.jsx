import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrders } from "../../services/orderService";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userOrders = await getCustomerOrders(currentUser.uid);
        // sort by newest
        userOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setOrders(userOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      processing: "bg-purple-50 text-purple-700 border-purple-200",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      returned: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${colors[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review the status of your past purchases and track ongoing deliveries.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest items!
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-gray-800 ml-1.5">{order.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Items List (Frozen prices) */}
              <div className="p-6 space-y-4">
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80"}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            PKR {item.price.toLocaleString()} &times; {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        PKR {item.subtotal?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Totals */}
                <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-700">Delivery Address: </span>
                    <span>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      Payment: <strong className="uppercase">{order.paymentMethod}</strong> (
                      {order.paymentStatus})
                    </span>
                    <span className="text-base font-extrabold text-indigo-600">
                      Total: PKR {order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
