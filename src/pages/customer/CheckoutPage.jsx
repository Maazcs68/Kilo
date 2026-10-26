import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orderService";

export default function CheckoutPage() {
  const { currentUser, userProfile } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = 200;
  const grandTotal = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    name: userProfile?.name || currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    city: userProfile?.city || "Lahore",
    postalCode: userProfile?.postalCode || "",
    paymentMethod: "cod" // Cash on Delivery
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const [error, setError] = useState("");

  if (cart.length === 0 && !orderSuccessId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <Link to="/products" className="text-sm font-semibold text-indigo-600 underline">
          Return to shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please sign in or create an account to complete your checkout.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderResult = await createOrder({
        userId: currentUser.uid,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        items: cart, // Prices get frozen inside createOrder per section 38
        subtotal: subtotal,
        shipping: shippingFee,
        discount: 0,
        total: grandTotal,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: "Pakistan"
        }
      });

      clearCart();
      setOrderSuccessId(orderResult.id);
    } catch (err) {
      console.error("Order creation error:", err);
      setError(`Failed to place order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccessId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
        <p className="text-sm text-gray-600">
          Thank you for shopping with Meshoo Online Store. Your order ID is:
        </p>
        <div className="font-mono text-xs bg-gray-100 p-3 rounded-lg border border-gray-200 select-all">
          {orderSuccessId}
        </div>
        <p className="text-xs text-gray-500">
          You will receive your items via Cash on Delivery within 2-4 business days.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" /> Shipping Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Street Address</label>
            <input
              type="text"
              required
              placeholder="House/Apartment #, Street name, Sector"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code (Optional)</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                disabled
                value="Pakistan"
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Payment Option</h3>
            <label className="flex items-center gap-3 p-3.5 border-2 border-indigo-600 rounded-xl bg-indigo-50/40 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="flex-1">
                <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                <p className="text-xs text-gray-500">Pay when your order arrives at your doorstep.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Review & Price Freeze Confirmation */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Your Order Items
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs">
                <div className="truncate max-w-[180px]">
                  <span className="font-semibold text-gray-800">{item.name}</span>
                  <p className="text-gray-400">Qty: {item.quantity} &times; PKR {item.price.toLocaleString()}</p>
                </div>
                <span className="font-bold text-gray-900">
                  PKR {item.subtotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">PKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-900">PKR {shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-indigo-600">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:bg-gray-400"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Price Protection
            </div>
            <p>
              Your order items and prices are locked at the time of purchase and will not change.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
