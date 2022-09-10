import { QueryBooleanType, QueryPagination } from './commons';

type Sortable = 'name' | 'durationDays';

export type CategoryQuery = QueryPagination & {
  name?: string;
  optional?: QueryBooleanType;
  include?: 'filters'[];
  sortByAsc?: Sortable[];
  sortByDesc?: Sortable[];
};
