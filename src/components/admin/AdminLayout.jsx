import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-white">
              Meshoo Admin
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-900 text-purple-200">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Firebase Project: web-application-ad62e</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Store Management Console</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Logged in as:</span>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {userProfile?.name || "Admin"}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
