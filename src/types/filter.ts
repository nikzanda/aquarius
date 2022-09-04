import { QueryPagination } from './commons';

export type FilterQuery = QueryPagination & {
  categoryId?: string;
  include?: 'category'[]
};

export type FilterBody = {
  categoryId: number;
};
