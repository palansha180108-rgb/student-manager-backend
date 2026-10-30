export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sales?: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
