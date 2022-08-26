import { QueryBooleanType, QueryPagination } from './commons';

export type FilterQuery = QueryPagination & {
  categoryId?: string;
  isActive?: QueryBooleanType;
};
