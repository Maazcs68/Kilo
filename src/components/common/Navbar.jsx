import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, Shield, Menu, X, LogOut, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistIds } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Meshoo
            </span>
            <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-indigo-50 text-indigo-700">
              Store
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-indigo-600 transition">
              All Products
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-600 hover:text-pink-600 transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Portal Shortcut if Admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {/* User Account / Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs">
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>

                {userDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm z-50"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 truncate">{userProfile?.name || "Customer"}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          ADMIN
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" /> Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            All Products
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-purple-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
