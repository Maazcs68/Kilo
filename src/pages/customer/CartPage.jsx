import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const shippingFee = 200;
  const grandTotal = subtotal > 0 ? subtotal + shippingFee : 0;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Looks like you haven't added any items to your shopping cart yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Shopping Cart ({totalItems} items)</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <img
                src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-50"
              />

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-bold text-gray-900 text-sm hover:text-indigo-600 transition"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500">Unit Price: PKR {item.price.toLocaleString()}</p>
                <p className="text-xs font-semibold text-indigo-700">
                  Subtotal: PKR {item.subtotal.toLocaleString()}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">PKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Shipping</span>
              <span className="font-semibold text-gray-900">PKR {shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold text-gray-900">
              <span>Grand Total</span>
              <span className="text-indigo-600">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-center text-[11px] text-gray-400">
            Cash on Delivery (COD) supported across Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
}
