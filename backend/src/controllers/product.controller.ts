import { Request, Response } from 'express';
import { getInclude } from '../helpers/product';
import { FindAllResponse, QueryParamId, TypedRequestQuery, TypedResponse } from '../types/commons';
import { Include, ProductCreateBody, ProductQuery, ProductUpdateBody } from '../types/product';
import client from '../../prisma/index';

const { product: productDB } = client;

export const findAll = async (req: TypedRequestQuery<ProductQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, name, include, sortByAsc, sortByDesc } = req.query;

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
      ...(include?.length && {
        include: getInclude(include),
      }),
      where,
    }),
    productDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId, unknown, unknown, { include: Include[] }>, res: Response) => {
  const { id } = req.params;
  const { include } = req.query;

  const product = await productDB.findUnique({
    ...(include?.length && {
      include: getInclude(include),
    }),
    where: {
      id: +id,
    },
  });

  res.json(product);
};

export const create = async (
  req: Request<unknown, unknown, ProductCreateBody, { include: Include[] }>,
  res: Response
) => {
  const { include } = req.query;
  const { name, category, useWhenRefilling, frequencyInDays, quantity } = req.body;

  try {
    const newProduct = await productDB.create({
      ...(include?.length && {
        include: getInclude(include),
      }),
      data: {
        name,
        category,
        useWhenRefilling,
        frequencyInDays,
        quantity,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const update = async (
  req: Request<QueryParamId, unknown, ProductUpdateBody, { include: Include[] }>,
  res: Response
) => {
  const { id } = req.params;
  const { include } = req.query;
  const { name, category, useWhenRefilling, frequencyInDays, quantity } = req.body;

  try {
    const updatedProduct = await productDB.update({
      ...(include?.length && {
        include: getInclude(include),
      }),
      where: {
        id: +id,
      },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(useWhenRefilling != null && { useWhenRefilling }),
        ...(frequencyInDays && { frequencyInDays }),
        ...(quantity && { quantity }),
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const remove = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  try {
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
  } catch (error) {
    res.status(400).json(error);
  }
};
