import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CategoryQuery } from '../types/category';
import { TypedRequestQuery } from '../types/commons';

const { category: categoryDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<CategoryQuery>, res: Response) => {
  const { skip, take, name, optional, include } = req.query;

  const categories = await categoryDB.findMany({
    skip: +skip,
    ...(+take > 0 && { take: +take }),
    where: {
      ...(name && { name }),
      ...(optional && { optional: ['true', '1'].includes(optional) }),
    },
    ...(include && {
      include: {
        ...(include.includes('filters') && {
          filters: {
            where: {
              isActive: true,
            },
          },
        }),
      },
    }),
  });
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
