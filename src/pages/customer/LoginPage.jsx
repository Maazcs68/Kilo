import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle, AlertTriangle, KeyRound, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isPlaceholderKey } from "../../firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { login, loginWithGoogle, resetPassword, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { profile } = await login({ email, password });
      // If admin, redirect to admin dashboard; otherwise to intended page
      if (profile?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { profile } = await loginWithGoogle();
      if (profile?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(`Reset failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Meshoo
          </span>
          <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="text-xs text-gray-500">Access customer orders or administrator controls</p>
        </div>

        {isPlaceholderKey && (
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Firebase Web API Key Required</span>
              <p className="text-amber-800 leading-relaxed">
                Your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold">.env</code> file currently contains a dummy API key. Replace <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold">VITE_FIREBASE_API_KEY</code> with your real key from Firebase Console.
              </p>
              <p className="text-amber-700">
                👉 In the meantime, use the <strong>Quick Sign In as Admin</strong> button below to test without a key.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetModalOpen(true);
                }}
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition disabled:bg-gray-400"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Authentication
        </button>

        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              loginAsDemoAdmin();
              navigate("/admin/dashboard");
            }}
            className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold text-purple-700 transition flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-purple-600" />
            ⚡ Quick Sign In as Admin (Development Mode)
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>

        {/* Password Reset Modal */}
        {resetModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-gray-900">Reset Password</h3>
              <p className="text-xs text-gray-500">
                Enter your registered email address and we'll send you a password reset link.
              </p>
              {resetSent ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl">
                  Password reset link sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResetModalOpen(false)}
                      className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
                    >
                      Send Email
                    </button>
                  </div>
                </form>
              )}
              {resetSent && (
                <button
                  onClick={() => {
                    setResetModalOpen(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
