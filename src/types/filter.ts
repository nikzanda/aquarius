import { QueryPagination } from './commons';

export type FilterQuery = QueryPagination & {
  categoryId?: string;
};

export type FilterBody = {
  categoryId: number;
};
