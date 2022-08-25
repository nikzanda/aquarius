import { QueryPagination } from './commons';

export type FilterQuery = QueryPagination & {
  categoryId?: string;
  isActive?: 'true' | '1' | 'false' | '0';
};
