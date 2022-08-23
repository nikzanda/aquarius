import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const { category: categoryDB } = new PrismaClient();

export const findAll = async (req: Request, res: Response) => {
  const categories = await categoryDB.findMany();
  res.json(categories);
};

export const findOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryDB.findUnique({
    where: {
      id: +id,
    },
  });
  res.json(category);
};
