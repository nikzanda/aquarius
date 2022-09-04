import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { addDays } from 'date-fns';
import { FindAllResponse, QueryParamId, TypedRequestBody, TypedRequestQuery, TypedResponse } from '../types/commons';
import { FilterBody, FilterQuery } from '../types/filter';

const { filter: filterDB, category: categoryDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<FilterQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, categoryId, include } = req.query;

  const where = {
    ...(categoryId && { categoryId: +categoryId }),
  };

  const [result, count] = await Promise.all([
    filterDB.findMany({
      skip: +skip,
      ...(+take > 0 && { take: +take }),
      where,
      ...(include && {
        include: Object.fromEntries(include.map((inc) => [inc, true])),
      }),
    }),
    filterDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId, unknown, unknown, { include: string[] }>, res: Response) => {
  const { id } = req.params;
  const { include } = req.query;

  const filter = await filterDB.findUnique({
    where: {
      id: +id,
    },
    ...(include && {
      include: Object.fromEntries(include.map((inc) => [inc, true])),
    }),
  });

  res.json(filter);
};

export const create = async (req: TypedRequestBody<FilterBody>, res: Response) => {
  const { categoryId } = req.body;

  const category = await categoryDB.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return res.sendStatus(400);
  }

  const expirationDate = addDays(new Date(), category.durationDays);

  const newFilter = await filterDB.create({
    data: {
      categoryId,
      expirationDate,
    },
  });

  res.status(201).json(newFilter);
};

export const remove = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const filter = await filterDB.findUnique({
    where: {
      id: +id,
    },
  });

  if (!filter) {
    return res.sendStatus(404);
  }

  await filterDB.delete({
    where: {
      id: +id,
    },
  });

  res.sendStatus(204);
};
