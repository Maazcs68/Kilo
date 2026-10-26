import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

const ORDERS_COLLECTION = "orders";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned"
];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded"
];

/**
 * Place a new order (Customer)
 * Stores the frozen items and prices at the moment of order placement.
 */
export async function createOrder({
  userId,
  customerName,
  email,
  phone,
  items, // [{ productId, name, image, price, quantity, subtotal }]
  subtotal,
  shipping = 200,
  discount = 0,
  total,
  paymentMethod = "cod",
  shippingAddress
}) {
  const colRef = collection(db, ORDERS_COLLECTION);

  // Freeze item details and calculate/verify
  const frozenItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image || "",
    price: Number(item.price), // Price frozen at time of purchase
    quantity: Number(item.quantity),
    subtotal: Number(item.price) * Number(item.quantity)
  }));

  const calculatedSubtotal = frozenItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const calculatedTotal = calculatedSubtotal + Number(shipping) - Number(discount);

  const payload = {
    userId,
    customerName,
    email,
    phone,
    items: frozenItems,
    subtotal: subtotal !== undefined ? Number(subtotal) : calculatedSubtotal,
    shipping: Number(shipping),
    discount: Number(discount),
    total: total !== undefined ? Number(total) : calculatedTotal,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    orderStatus: "pending",
    shippingAddress,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(colRef, payload);
  return { id: docRef.id, ...payload };
}

/**
 * Fetch orders for a customer
 */
export async function getCustomerOrders(userId) {
  const colRef = collection(db, ORDERS_COLLECTION);
  const q = query(colRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Fetch all orders (Admin)
 */
export async function getAllOrdersAdmin() {
  const colRef = collection(db, ORDERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * Get single order by ID
 */
export async function getOrderById(orderId) {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Update order and payment status (Admin)
 */
export async function updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const payload = { updatedAt: serverTimestamp() };
  if (orderStatus) payload.orderStatus = orderStatus;
  if (paymentStatus) payload.paymentStatus = paymentStatus;
  await updateDoc(docRef, payload);
  return { id: orderId, ...payload };
}
