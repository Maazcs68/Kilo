import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const REVIEWS_COLLECTION = "reviews";

/**
 * Fetch approved reviews for a product (Customer)
 */
export async function getProductReviews(productId) {
  const colRef = collection(db, REVIEWS_COLLECTION);
  const q = query(
    colRef,
    where("productId", "==", productId),
    where("status", "==", "approved")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Fetch all reviews (Admin)
 */
export async function getAllReviewsAdmin() {
  const colRef = collection(db, REVIEWS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Submit a customer review (starts with status 'pending')
 */
export async function createReview({ productId, userId, userName, rating, comment }) {
  const colRef = collection(db, REVIEWS_COLLECTION);
  const payload = {
    productId,
    userId,
    userName,
    rating: Number(rating),
    comment,
    status: "pending", // Requires admin approval per rules
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);
  return { id: docRef.id, ...payload };
}

/**
 * Update review status (Admin) - 'approved' | 'rejected'
 */
export async function updateReviewStatus(reviewId, status) {
  const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
  return { id: reviewId, status };
}

/**
 * Delete a review (Admin)
 */
export async function deleteReview(reviewId) {
  const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
  await deleteDoc(docRef);
  return reviewId;
}
