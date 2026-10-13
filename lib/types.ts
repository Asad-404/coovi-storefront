export interface Product {
  _id: string;
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
  descriptionBn?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  size?: string;
  category: string;
  stock: number;
  inStock: boolean;
  // Out of stock pre-orders: orderable when on, shipping in about preorderDays
  allowPreorder?: boolean;
  preorderDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  // Sourced for this customer; ships in about preorderDays
  preorder?: boolean;
  preorderDays?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/settings: what the owner sets on the admin Settings page
export interface ShopSettings {
  whatsappNumber: string; // 8801XXXXXXXXX
  supportPhone: string; // 01XXXXXXXXX, or "" when not shown
  announcementText: string;
  announcementActive: boolean;
}
