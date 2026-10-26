import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, toggleWishlistProduct } from "../services/wishlistService";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      if (currentUser?.uid) {
        setLoading(true);
        try {
          const ids = await getWishlist(currentUser.uid);
          setWishlistIds(ids);
        } catch (err) {
          console.error("Failed to load wishlist:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistIds([]);
      }
    }
    loadWishlist();
  }, [currentUser]);

  const toggleWishlist = async (productId) => {
    if (!currentUser) {
      alert("Please log in to manage your wishlist.");
      return;
    }
    try {
      const updated = await toggleWishlistProduct(currentUser.uid, productId);
      setWishlistIds(updated);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        loading,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
