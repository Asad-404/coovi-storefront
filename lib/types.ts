export interface Product {
  _id: string;
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
  descriptionBn?: string;
  price: number;
  images: string[];
  size?: string;
  category: string;
  stock: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}
