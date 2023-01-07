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
  tests: TestsOnRefills[];
  products: ProductsOnRefills[];
};

/**
 * Model Product
 *
 */
export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  quantity: string | null;
  frequencyInDays: number | null;
  useWhenRefilling: boolean;
  createdAt: string;
  refills: ProductsOnRefills[];
};

/**
 * Model ProductsOnRefills
 *
 */
export type ProductsOnRefills = {
  id: number;
  refillId: number;
  productId: number;
  createdAt: string;
  refill: Refill;
  product: Product;
};

/**
 * Model Strip
 *
 */
export type Strip = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  tests: TestsOnStrips[];
};

/**
 * Model Test
 *
 */
export type Test = {
  id: number;
  name: string;
  minLevel: number | null;
  maxLevel: number | null;
  createdAt: string;
  strips: TestsOnStrips[];
  refills: TestsOnRefills[];
};

/**
 * Model TestsOnStrips
 *
 */
export type TestsOnStrips = {
  stripId: number;
  testId: number;
  strip: Strip;
  test: Test;
};

/**
 * Model TestsOnRefills
 *
 */
export type TestsOnRefills = {
  id: number;
  refillId: number;
  testId: number;
  value: number;
  createdAt: Date;
  refill: Refill;
  test: Test;
};

/**
 * Enums
 */
export enum ProductCategory {
  WATER,
  PLANT,
}
