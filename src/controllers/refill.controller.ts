import { PrismaClient } from '.prisma/client';
import { Request, Response } from 'express';
import { QueryParamId, TypedRequestBody, TypedRequestQuery } from '../types/commons';
import { RefillBody, RefillQuery } from '../types/refill';

const { refill: refillDB, product: productDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<RefillQuery>, res: Response) => {
  const { skip, take, sortByAsc, sortByDesc } = req.query;

  const refills = await refillDB.findMany({
    skip: +skip,
    ...(+take > 0 && { take: +take }),
    orderBy: [
      ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
      ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
    ],
    include: {
      // TODO: aggiungere include nella query
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  res.json(refills);
};

export const findOne = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;
  const refill = await refillDB.findUnique({
    where: {
      id: +id,
    },
  });
  res.json(refill);
};

export const create = async (req: TypedRequestBody<RefillBody>, res: Response) => {
  const { productsIds } = req.body;
  const products = [];

  if (productsIds && productsIds.length > 0) {
    products.push(
      ...(await productDB.findMany({
        where: {
          id: {
            in: productsIds,
          },
        },
      }))
    );
  }

  const newRefill = await refillDB.create({
    data: {
      products: {
        create: [
          ...products.map(({ id }) => ({
            product: { connect: { id } },
          })),
        ],
      },
    },
  });

  res.status(201).json(newRefill);
};

// TODO: update
