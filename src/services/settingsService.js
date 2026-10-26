import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const SETTINGS_DOC = "settings/store";

export const DEFAULT_SETTINGS = {
  storeName: "Meshoo Online Store",
  logo: "",
  email: "support@meshoo.com",
  phone: "+92 300 1234567",
  address: "Lahore, Pakistan",
  currency: "PKR",
  shippingFee: 200,
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: ""
  },
  maintenanceMode: false
};

/**
 * Get store settings
 */
export async function getStoreSettings() {
  const docRef = doc(db, "settings", "store");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...DEFAULT_SETTINGS, ...docSnap.data() };
  }
  return DEFAULT_SETTINGS;
}

/**
 * Update store settings (Admin)
 */
export async function updateStoreSettings(newSettings) {
  const docRef = doc(db, "settings", "store");
  await setDoc(docRef, newSettings, { merge: true });
  return newSettings;
}
