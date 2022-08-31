import { QueryPagination } from './commons';

type Sortable = 'name' | 'createdAt';

export type ProductQuery = QueryPagination & {
  name?: string;
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type ProductBody = {
  name: string;
};
