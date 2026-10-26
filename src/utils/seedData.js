import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const INITIAL_CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Gadgets, audio devices, and smart tech accessories",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    description: "Trendy clothing, shoes, and wearable apparel",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    id: "home-living",
    name: "Home & Living",
    description: "Decor, kitchenware, and modern lifestyle furnishings",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    status: "active"
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    description: "Skincare, cosmetics, and self-care essentials",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    status: "active"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-wh-001",
    name: "Wireless Noise-Canceling Headphones",
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear acoustic tuning.",
    price: 5000,
    discountPrice: 3999,
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "SoundMaster",
    sku: "MSH-WH-001",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewCount: 12,
    status: "active",
    featured: true
  },
  {
    id: "prod-sw-002",
    name: "Smart Fitness Watch Ultra",
    description: "Track your heart rate, sleep metrics, and sports activities with an AMOLED always-on display and 5 ATM water resistance.",
    price: 7500,
    discountPrice: 5999,
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "PulseTech",
    sku: "MSH-SW-002",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    reviewCount: 9,
    status: "active",
    featured: true
  },
  {
    id: "prod-cb-003",
    name: "Minimalist Leather Crossbody Bag",
    description: "Crafted with premium vegan leather, multiple organizing compartments, and water-resistant lining.",
    price: 3200,
    discountPrice: 2499,
    categoryId: "fashion",
    categoryName: "Fashion & Apparel",
    brand: "UrbanVibe",
    sku: "MSH-BAG-003",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviewCount: 14,
    status: "active",
    featured: true
  },
  {
    id: "prod-ds-004",
    name: "Aroma Ultrasonic Ceramic Diffuser",
    description: "Sleek porcelain ultrasonic diffuser for essential oils with warm LED ambient night-light mode.",
    price: 2800,
    discountPrice: 2199,
    categoryId: "home-living",
    categoryName: "Home & Living",
    brand: "AuraLiving",
    sku: "MSH-DIF-004",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewCount: 20,
    status: "active",
    featured: true
  }
];

/**
 * Seeds initial store collections if they are empty
 */
export async function seedInitialStoreData() {
  try {
    // 1. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, "categories", cat.id), {
        ...cat,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    }

    // 2. Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, "products", prod.id), {
        ...prod,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    }

    // 3. Seed Store Settings
    await setDoc(doc(db, "settings", "store"), {
      storeName: "Meshoo Online Store",
      currency: "PKR",
      shippingFee: 200,
      maintenanceMode: false,
      email: "support@meshoo.com",
      phone: "+92 300 1234567",
      address: "Lahore, Pakistan",
      updatedAt: new Date()
    }, { merge: true });

    return { success: true, message: "Categories, Products, and Settings seeded successfully!" };
  } catch (error) {
    console.error("Error seeding initial data:", error);
    throw error;
  }
}
