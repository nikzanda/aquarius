import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const { filter: filterDB } = new PrismaClient();

export const findAll = async (req: Request, res: Response) => {
  const filters = await filterDB.findMany();
  res.json(filters);
};
