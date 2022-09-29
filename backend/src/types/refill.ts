import { QueryPagination } from './commons';

type Sortable = 'id' | 'createdAt';
export type Include = 'products' | 'tests';

export type RefillQuery = QueryPagination & {
  include?: Include[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

interface TestInput {
  id: number;
  value: number;
}

export type RefillUpdateBody = {
  tests?: TestInput[];
  productId?: number;
};
