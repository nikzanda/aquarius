import { QueryPagination } from './commons';

type Sortable = 'id' | 'createdAt';

export type RefillQuery = QueryPagination & {
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type RefillBody = {
  productsIds?: number[];
};
