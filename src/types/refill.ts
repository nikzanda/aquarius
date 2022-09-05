import { QueryPagination } from './commons';

type Sortable = 'id' | 'createdAt';

export type RefillQuery = QueryPagination & {
  include?: 'products'[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type RefillCreateBody = {
  productsIds?: number[];
};

export type RefillUpdateBody = {
  productId: number;
};
