import { QueryBooleanType, QueryPagination } from './commons';

type Sortable = 'name' | 'durationDays';
export type Include = 'filters';

export type CategoryQuery = QueryPagination & {
  name?: string;
  optional?: QueryBooleanType;
  include?: Include[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};
