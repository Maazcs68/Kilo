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
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const PRODUCTS_COLLECTION = "products";

/**
 * Fetch products with optional filters
 */
export async function getProducts({ categoryId = null, featured = null, status = "active", limitCount = 50 } = {}) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  let constraints = [];

  if (status) {
    constraints.push(where("status", "==", status));
  }
  if (categoryId) {
    constraints.push(where("categoryId", "==", categoryId));
  }
  if (featured !== null) {
    constraints.push(where("featured", "==", featured));
  }

  // Fallback ordering if no composite index yet
  constraints.push(limit(limitCount));

  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Fetch all products (for admin)
 */
export async function getAllProductsAdmin() {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Get single product by ID
 */
export async function getProductById(productId) {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Create a new product (Admin)
 */
export async function createProduct(productData) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const payload = {
    name: productData.name || "",
    description: productData.description || "",
    price: Number(productData.price) || 0,
    discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
    categoryId: productData.categoryId || "",
    categoryName: productData.categoryName || "",
    brand: productData.brand || "",
    sku: productData.sku || `MSH-${Date.now()}`,
    stock: Number(productData.stock) || 0,
    images: productData.images || [],
    rating: Number(productData.rating) || 0,
    reviewCount: Number(productData.reviewCount) || 0,
    status: productData.status || "active",
    featured: Boolean(productData.featured),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(colRef, payload);
  return { id: docRef.id, ...payload };
}

/**
 * Update an existing product (Admin)
 */
export async function updateProduct(productId, productData) {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const payload = {
    ...productData,
    price: productData.price !== undefined ? Number(productData.price) : undefined,
    discountPrice: productData.discountPrice !== undefined ? (productData.discountPrice ? Number(productData.discountPrice) : null) : undefined,
    stock: productData.stock !== undefined ? Number(productData.stock) : undefined,
    updatedAt: serverTimestamp()
  };
  // remove undefined keys
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
  await updateDoc(docRef, payload);
  return { id: productId, ...payload };
}

/**
 * Delete a product (Admin)
 */
export async function deleteProduct(productId) {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
  return productId;
}
