import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const findAll = async (req: Request, res: Response) => {
  const filters = await prisma.filter.findMany()
  res.json(filters)
}