import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export type QueryPagination = {
  skip: string;
  take: string;
};

export type QueryBooleanType = 'true' | '1' | 'false' | '0';

export interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}
