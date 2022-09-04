import { PrismaClient } from '.prisma/client';
import { Request, Response } from 'express';
import { FindAllResponse, QueryParamId, TypedRequestBody, TypedRequestQuery, TypedResponse } from '../types/commons';
import { RefillBody, RefillQuery } from '../types/refill';

const { refill: refillDB, product: productDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<RefillQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, sortByAsc, sortByDesc } = req.query;

  const [result, count] = await Promise.all([
    refillDB.findMany({
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
    }),
    refillDB.count(),
  ]);

  res.json({
    result,
    count,
  });
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
