import { ProductCategory } from '.prisma/client';
import { QueryPagination } from './commons';

type Sortable = 'name' | 'createdAt';
export type Include = 'refills';

export type ProductQuery = QueryPagination & {
  name?: string;
  include?: Include[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type ProductCreateBody = {
  name: string;
  category: ProductCategory;
  quantity?: string;
  frequencyInDays?: number;
  useWhenRefilling: boolean;
};

export type ProductUpdateBody = {
  name?: string;
  category?: ProductCategory;
  quantity?: string;
  frequencyInDays?: number;
  useWhenRefilling?: boolean;
};
