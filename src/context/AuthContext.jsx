import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  loginUser,
  registerUser,
  logoutUser,
  loginWithGoogle,
  resetPassword,
  getUserProfile
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or refresh profile
  const fetchProfile = async (uid) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
      return profile;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    // Check if demo user was active
    const savedDemo = localStorage.getItem("meshoo_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setCurrentUser(parsed.user);
        setUserProfile(parsed.profile);
      } catch {
        localStorage.removeItem("meshoo_demo_user");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        localStorage.removeItem("meshoo_demo_user");
        setCurrentUser(user);
        await fetchProfile(user.uid);
      } else if (!localStorage.getItem("meshoo_demo_user")) {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemoAdmin = () => {
    const demoUser = {
      uid: "demo-admin-uid",
      email: "admin@meshoo.com",
      displayName: "Store Administrator"
    };
    const demoProfile = {
      id: "demo-admin-uid",
      name: "Store Administrator",
      email: "admin@meshoo.com",
      role: "admin",
      status: "active"
    };
    setCurrentUser(demoUser);
    setUserProfile(demoProfile);
    localStorage.setItem("meshoo_demo_user", JSON.stringify({ user: demoUser, profile: demoProfile }));
    return { user: demoUser, profile: demoProfile };
  };

  const handleLogout = async () => {
    localStorage.removeItem("meshoo_demo_user");
    setCurrentUser(null);
    setUserProfile(null);
    try {
      await logoutUser();
    } catch {
      // ignore
    }
  };

  const isAdmin = userProfile?.role === "admin";

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    login: loginUser,
    register: registerUser,
    logout: handleLogout,
    loginWithGoogle,
    loginAsDemoAdmin,
    resetPassword,
    refreshProfile: () => currentUser && fetchProfile(currentUser.uid)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
