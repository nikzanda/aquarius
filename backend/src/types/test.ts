import { QueryPagination } from './commons';

type Sortable = 'name' | 'createdAt';
export type Include = 'strips' | 'refills';

export type TestQuery = QueryPagination & {
  name?: string;
  include?: Include[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};

export type TestCreateBody = {
  name: string;
  minLevel?: number;
  maxLevel?: number;
};

export type TestUpdateBody = {
  name?: string;
  minLevel?: number;
  maxLevel?: number;
};
