import { PrismaClient, Product } from '@prisma/client';
import { Request, Response } from 'express';
import { FindAllResponse, QueryParamId, TypedRequestBody, TypedRequestQuery, TypedResponse } from '../types/commons';
import { ProductCreateBody, ProductQuery, ProductUpdateBody } from '../types/product';

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

export const create = async (req: TypedRequestBody<ProductCreateBody>, res: Response<Product>) => {
  const { name, category, useWhenRefilling, frequencyInDays, quantity } = req.body;

  const newProduct = await productDB.create({
    data: {
      name,
      category,
      useWhenRefilling,
      frequencyInDays,
      quantity,
    },
  });

  res.status(201).json(newProduct);
};

export const update = async (req: Request<QueryParamId, unknown, ProductUpdateBody>, res: Response<Product>) => {
  const { id } = req.params;
  const { name, category, useWhenRefilling, frequencyInDays, quantity } = req.body;

  const updatedProduct = await productDB.update({
    where: {
      id: +id,
    },
    data: {
      ...(name && { name }),
      ...(category && { category }),
      ...(useWhenRefilling && { useWhenRefilling }),
      ...(frequencyInDays && { frequencyInDays }),
      ...(quantity && { quantity }),
    },
  });

  res.json(updatedProduct);
};

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
