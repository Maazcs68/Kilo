import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export function formatAuthError(err) {
  const code = err?.code || "";
  const msg = err?.message || "";

  if (code.includes("api-key-not-valid") || msg.includes("api-key-not-valid")) {
    return "Firebase API Key is invalid or set to a placeholder. Please update 'VITE_FIREBASE_API_KEY' in your .env file with your valid Web API key from Firebase Console (Project Settings > General), then restart your Vite dev server.";
  }
  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "Invalid email or password. Please verify your credentials.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email address already exists.";
  }
  if (code === "auth/weak-password") {
    return "Password must be at least 6 characters long.";
  }
  if (code === "auth/invalid-email") {
    return "Please provide a valid email address.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Sign-in popup was closed before completing.";
  }
  if (code === "auth/operation-not-allowed") {
    return "This sign-in method is not enabled in Firebase Console (Authentication > Sign-in method).";
  }
  return msg || "Authentication request failed. Please try again.";
}

/**
 * Register a new customer
 */
export async function registerUser({ name, email, password, phone = "" }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userDocRef = doc(db, "users", user.uid);
    const userData = {
      name,
      email: user.email,
      phone,
      photoURL: user.photoURL || "",
      role: "customer", // default role
      address: "",
      city: "",
      postalCode: "",
      country: "Pakistan",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(userDocRef, userData);

    return { user, profile: userData };
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Login with email and password
 */
export async function loginUser({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const profile = await getUserProfile(user.uid);
    return { user, profile };
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Login or Sign Up with Google
 */
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    let profile;
    if (!docSnap.exists()) {
      profile = {
        name: user.displayName || "Google User",
        email: user.email,
        phone: user.phoneNumber || "",
        photoURL: user.photoURL || "",
        role: "customer",
        address: "",
        city: "",
        postalCode: "",
        country: "Pakistan",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, profile);
    } else {
      profile = docSnap.data();
    }

    return { user, profile };
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Logout current user
 */
export async function logoutUser() {
  return await signOut(auth);
}

/**
 * Password reset email
 */
export async function resetPassword(email) {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(userId) {
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, data) {
  const userDocRef = doc(db, "users", userId);
  // Prevent changing role directly from user update
  const sanitized = { ...data, updatedAt: serverTimestamp() };
  delete sanitized.role;
  await updateDoc(userDocRef, sanitized);
}
