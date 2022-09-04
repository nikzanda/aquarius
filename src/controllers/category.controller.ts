import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CategoryQuery } from '../types/category';
import { FindAllResponse, QueryParamId, TypedRequestQuery, TypedResponse } from '../types/commons';

const { category: categoryDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<CategoryQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, name, optional, include, sortByAsc, sortByDesc } = req.query;

  const where = {
    ...(name && { name: { search: name } }),
    ...(optional && { optional: ['true', '1'].includes(optional) }),
  };

  const [result, count] = await Promise.all([
    categoryDB.findMany({
      skip: +skip,
      ...(+take > 0 && { take: +take }),
      orderBy: [
        ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
        ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
      ],
      ...(include && {
        include: {
          filters: true,
        },
      }),
      where,
    }),
    categoryDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
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
