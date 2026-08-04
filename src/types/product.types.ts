export type Discount = {
  amount: number;
  percentage: number;
};

export type SizeOption = {
  _id: string;
  size: string;
  stock: number;
};

export type ProductVariant = {
  _id: string;
  color: string;
  sizesArray: SizeOption[];
  price: number;
  stock: number;
  images: string[];
  isDefault: boolean;
};

export type Product = {
  id: number | string;
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  variants?: ProductVariant[];
};
