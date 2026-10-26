import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const WISHLISTS_COLLECTION = "wishlists";

/**
 * Get customer's wishlist
 */
export async function getWishlist(userId) {
  const docRef = doc(db, WISHLISTS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().productIds || [];
  }
  return [];
}

/**
 * Toggle product in customer's wishlist
 */
export async function toggleWishlistProduct(userId, productId) {
  const currentList = await getWishlist(userId);
  const exists = currentList.includes(productId);
  const updatedList = exists
    ? currentList.filter((id) => id !== productId)
    : [...currentList, productId];

  const docRef = doc(db, WISHLISTS_COLLECTION, userId);
  await setDoc(docRef, {
    productIds: updatedList,
    updatedAt: serverTimestamp()
  }, { merge: true });

  return updatedList;
}
