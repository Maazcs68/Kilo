import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Upload file to Firebase Storage and get public URL
 */
export async function uploadFile(path, file) {
  const fileRef = ref(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * Upload product image
 */
export async function uploadProductImage(productId, file) {
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = `products/${productId}/${filename}`;
  return await uploadFile(path, file);
}

/**
 * Upload category image
 */
export async function uploadCategoryImage(categoryId, file) {
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = `categories/${categoryId}/${filename}`;
  return await uploadFile(path, file);
}

/**
 * Upload user profile picture
 */
export async function uploadUserProfilePicture(userId, file) {
  const filename = `avatar_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = `users/${userId}/${filename}`;
  return await uploadFile(path, file);
}

/**
 * Upload store branding / logo
 */
export async function uploadStoreAsset(fileName, file) {
  const path = `store/${fileName}`;
  return await uploadFile(path, file);
}

/**
 * Delete a file by its storage ref path
 */
export async function deleteStorageFile(storagePath) {
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}
