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

// Only Dhaka city is inside Dhaka; Dhaka suburbs and every other district are outside
export type DeliveryArea = "inside_dhaka" | "outside_dhaka";

// GET /orders/delivery-fee: the fee per area and the districts checkout offers
export interface DeliveryOptions {
  zones: Record<DeliveryArea, number>;
  districts: string[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  district?: string;
  deliveryArea?: DeliveryArea;
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
