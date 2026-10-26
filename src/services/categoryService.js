import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const CATEGORIES_COLLECTION = "categories";

/**
 * Fetch all active categories (Customer)
 */
export async function getActiveCategories() {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(colRef, where("status", "==", "active"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Fetch all categories (Admin)
 */
export async function getAllCategoriesAdmin() {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId) {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Create a new category (Admin)
 */
export async function createCategory(data) {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const payload = {
    name: data.name || "",
    description: data.description || "",
    image: data.image || "",
    status: data.status || "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);
  return { id: docRef.id, ...payload };
}

/**
 * Update an existing category (Admin)
 */
export async function updateCategory(categoryId, data) {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const payload = {
    ...data,
    updatedAt: serverTimestamp()
  };
  await updateDoc(docRef, payload);
  return { id: categoryId, ...payload };
}

/**
 * Delete a category (Admin)
 */
export async function deleteCategory(categoryId) {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(docRef);
  return categoryId;
}
