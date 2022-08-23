import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { addDays } from 'date-fns';

const { filter: filterDB, category: categoryDB } = new PrismaClient();

export const findAll = async (req: Request, res: Response) => {
  const filters = await filterDB.findMany();
  res.json(filters);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await filterDB.findUnique({
    where: {
      id: +id,
    },
  });
  res.json(category);
};

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
