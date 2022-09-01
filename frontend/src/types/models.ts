/**
 * Model Category
 *
 */
export type Category = {
  id: number;
  name: string;
  description: string;
  durationDays: number;
  optional: boolean;
  filters?: Filter[];
};

/**
 * Model Filter
 *
 */
export type Filter = {
  id: number;
  expirationDate: string;
  createdAt: string;
  categoryId: number;
  category?: Category;
};

/**
 * Model Refill
 *
 */
export type Refill = {
  id: number;
  createdAt: string;
  products: ProductsOnRefills[];
};

/**
 * Model Product
 *
 */
export type Product = {
  id: number;
  name: string;
  createdAt: string;
  refills: ProductsOnRefills[];
};

/**
 * Model ProductsOnRefills
 *
 */
export type ProductsOnRefills = {
  refillId: number;
  productId: number;
  createdAt: string;
  refill: Refill;
  product: Product;
};
