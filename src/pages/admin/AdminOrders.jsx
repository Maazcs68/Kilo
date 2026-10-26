import React, { useEffect, useState } from "react";
import { ShoppingBag, Eye, RefreshCw, CheckCircle, Clock } from "lucide-react";
import {
  getAllOrdersAdmin,
  updateOrderStatus,
  ORDER_STATUSES,
  PAYMENT_STATUSES
} from "../../services/orderService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersAdmin();
      data.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setOrders(data);
    } catch (err) {
      console.error("Orders load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus, paymentStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { orderStatus, paymentStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) }
            : o
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus })
        }));
      }
    } catch (err) {
      alert(`Update error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-xs text-gray-500 mt-1">Review orders, verify payments, and dispatch fulfillments</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Order Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{ord.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{ord.customerName}</p>
                      <p className="text-[10px] text-gray-400">{ord.email} | {ord.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {ord.createdAt?.toDate ? ord.createdAt.toDate().toLocaleDateString() : "Recent"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      PKR {ord.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={updatingId === ord.id}
                        value={ord.paymentStatus || "pending"}
                        onChange={(e) => handleStatusChange(ord.id, null, e.target.value)}
                        className="p-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                      >
                        {PAYMENT_STATUSES.map((ps) => (
                          <option key={ps} value={ps}>
                            {ps.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={updatingId === ord.id}
                        value={ord.orderStatus || "pending"}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value, null)}
                        className="p-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                      >
                        {ORDER_STATUSES.map((os) => (
                          <option key={os} value={os}>
                            {os.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Order Details</h3>
                <p className="font-mono text-xs text-gray-500">ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.email})</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p>
                <strong>Delivery Address:</strong> {selectedOrder.shippingAddress?.address},{" "}
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-xs font-bold uppercase text-gray-700 mb-2">
                Purchased Items (Frozen Prices)
              </h4>
              <div className="divide-y divide-gray-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-400">
                        Qty: {item.quantity} &times; PKR {item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      PKR {item.subtotal?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>PKR {selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>PKR {selectedOrder.shipping?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-100 pt-2">
                <span>Total:</span>
                <span className="text-indigo-600">PKR {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
