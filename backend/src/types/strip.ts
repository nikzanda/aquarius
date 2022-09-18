import { QueryPagination } from './commons';

type Sortable = 'name' | 'createdAt';
export type Include = 'tests';

export type StripQuery = QueryPagination & {
  name?: string;
  include?: Include[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type StripCreateBody = {
  name: string;
  description?: string;
  testsIds?: number[];
};

export type StripUpdateBody = {
  name?: string;
  description?: string;
  testsIds?: number[];
};
