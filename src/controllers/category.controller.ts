import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CategoryQuery } from '../types/category';
import { QueryParamId, TypedRequestQuery } from '../types/commons';

const { category: categoryDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<CategoryQuery>, res: Response) => {
  const { skip, take, name, optional, include, sortByAsc, sortByDesc } = req.query;

  const categories = await categoryDB.findMany({
    skip: +skip,
    ...(+take > 0 && { take: +take }),
    where: {
      ...(name && { name: { search: name } }),
      ...(optional && { optional: ['true', '1'].includes(optional) }),
    },
    orderBy: [
      ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
      ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
    ],
    ...(include && {
      include: {
        filters: true,
      },
    }),
  });
  res.json(categories);
};

export const findOne = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;
  const category = await categoryDB.findUnique({
    where: {
      id: +id,
    },
    // TODO: aggiungere include
  });
  res.json(category);
};
