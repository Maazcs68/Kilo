import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Meshoo
            </span>
            <p className="mt-3 text-sm text-gray-400">
              Your one-stop destination for quality lifestyle products, electronics, and daily essentials across Pakistan.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@meshoo.com</li>
              <li>Phone: +92 300 1234567</li>
              <li>Lahore, Pakistan</li>
              <li>Cash on Delivery available</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Backend Platform
            </h4>
            <p className="text-xs text-gray-400">
              Powered by Google Firebase:
            </p>
            <div className="mt-2 text-xs font-mono bg-gray-800 p-2.5 rounded text-indigo-300 border border-gray-700">
              Project ID: web-application-ad62e<br />
              Firestore + Storage + Auth
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Meshoo Online Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
