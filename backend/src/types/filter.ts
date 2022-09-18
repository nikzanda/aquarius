import { QueryPagination } from './commons';

export type Include = 'category';

export type FilterQuery = QueryPagination & {
  categoryId?: string;
  include?: Include[];
};

export type FilterBody = {
  categoryId: number;
};
