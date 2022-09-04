import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { FindAllResponse, QueryParamId, TypedRequestBody, TypedRequestQuery, TypedResponse } from '../types/commons';
import { ProductBody, ProductQuery } from '../types/product';

const { product: productDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<ProductQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, name, sortByAsc, sortByDesc } = req.query;

  const where = {
    ...(name && { name: { search: name } }),
  };

  const [result, count] = await Promise.all([
    productDB.findMany({
      skip: +skip,
      ...(+take > 0 && { take: +take }),
      orderBy: [
        ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
        ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
      ],
      where,
    }),
    productDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const product = await productDB.findUnique({
    where: {
      id: +id,
    },
  });

  res.json(product);
};

export const create = async (req: TypedRequestBody<ProductBody>, res: Response) => {
  const { name } = req.body;

  const newProduct = await productDB.create({
    data: {
      name,
    },
  });

  res.status(201).json(newProduct);
};

// TODO: update

export const remove = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const product = await productDB.findUnique({
    where: {
      id: +id,
    },
  });

  if (!product) {
    return res.sendStatus(404);
  }

  await productDB.delete({
    where: {
      id: +id,
    },
  });

  res.sendStatus(204);
};
