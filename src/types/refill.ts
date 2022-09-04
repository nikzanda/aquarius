import { QueryPagination } from './commons';

type Sortable = 'id' | 'createdAt';

export type RefillQuery = QueryPagination & {
  include?: 'products'[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type RefillBody = {
  productsIds?: number[];
};
