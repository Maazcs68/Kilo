import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Route protector for authentication and role authorization
 * @param {boolean} requireAdmin - If true, requires role === 'admin'
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, userProfile, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route protection
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 max-w-md mb-6">
          You do not have administrative privileges to view this section.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}
