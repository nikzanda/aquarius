import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { addDays } from 'date-fns';
import { TypedRequestQuery } from '../types/commons';
import { FilterQuery } from '../types/filter';

const { filter: filterDB, category: categoryDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<FilterQuery>, res: Response) => {
  const { skip, take, categoryId, isActive } = req.query;

  const filters = await filterDB.findMany({
    skip: +skip,
    ...(+take > 0 && { take: +take }),
    where: {
      ...(categoryId && { categoryId: +categoryId }),
      ...(isActive && { isActive: ['true', '1'].includes(isActive) }),
    },
  });

  res.json(filters);
};

// TODO: tipizzare params
export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const filter = await filterDB.findUnique({
    where: {
      id: +id,
    },
  });
  res.json(filter);
};

// TODO: tipizzare il body
export const create = async (req: Request, res: Response) => {
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

  await filterDB.updateMany({
    where: {
      categoryId,
      isActive: true,
      id: {
        not: newFilter.id,
      },
    },
    data: {
      isActive: false,
    },
  });

  res.status(201).json(newFilter);
};

// TODO: tipizzare il body
export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  const exists = await filterDB.count({
    where: {
      id: +id,
    },
  });

  if (!exists) {
    return res.sendStatus(404);
  }

  const updatedFilter = await filterDB.update({
    where: {
      id: +id,
    },
    data: {
      isActive: false,
    },
  });

  res.status(200).json(updatedFilter);
};
