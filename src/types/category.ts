import { QueryBooleanType, QueryPagination } from './commons';

export type CategoryQuery = QueryPagination & {
  name?: string;
  optional?: QueryBooleanType;
  include?: 'filters'[];
};
