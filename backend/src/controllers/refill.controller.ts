import { Request, Response } from 'express';
import { getInclude } from '../helpers/refill';
import { FindAllResponse, QueryParamId, TypedRequestQuery, TypedResponse } from '../types/commons';
import { Include, RefillCreateBody, RefillQuery, RefillUpdateBody } from '../types/refill';
import client from '../../prisma/index';

const { refill: refillDB, test: testDB, product: productDB, testsOnRefills: testsOnRefillsDB } = client;

export const findAll = async (req: TypedRequestQuery<RefillQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, sortByAsc, sortByDesc, include } = req.query;

  const [result, count] = await Promise.all([
    refillDB.findMany({
      skip: +skip,
      ...(+take > 0 && { take: +take }),
      orderBy: [
        ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
        ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
      ],
      ...(include?.length && {
        include: getInclude(include),
      }),
    }),
    refillDB.count(),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId, unknown, unknown, { include: Include[] }>, res: Response) => {
  const { id } = req.params;
  const { include } = req.query;

  const refill = await refillDB.findUnique({
    where: {
      id: +id,
    },
    ...(include?.length && {
      include: getInclude(include),
    }),
  });
  res.json(refill);
};

export const findLast = async (req: Request, res: Response) => {
  const lastRefill = await refillDB.findFirst({
    take: 1,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tests: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          test: true,
        },
      },
      products: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: true,
        },
      },
    },
  });

  res.json(lastRefill);
};

export const create = async (
  req: Request<unknown, unknown, RefillCreateBody, { include: Include[] }>,
  res: Response
) => {
  const { include } = req.query;
  const { tests: testsInput, productsIds } = req.body;
  const testsData = [];
  const products = [];

  try {
    if (testsInput && testsInput.length > 0) {
      const tests = await testDB.findMany({
        where: {
          id: {
            in: testsInput.map(({ id }) => id),
          },
        },
      });

      testsData.push(
        ...tests.map(({ id }) => ({
          testId: id,
          value: testsInput.find(({ id: testInputId }) => id === testInputId)?.value || 0,
        }))
      );
    }

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
      ...(include?.length && {
        include: getInclude(include),
      }),
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

    if (testsData.length > 0) {
      testsOnRefillsDB.createMany({
        data: testsData.map((testData) => ({
          ...testData,
          refillId: newRefill.id,
        })),
      });
    }

    res.status(201).json(newRefill);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const update = async (
  req: Request<QueryParamId, unknown, RefillUpdateBody, { include: Include[] }>,
  res: Response
) => {
  const { id } = req.params;
  const { include } = req.query;
  const { tests: testsInput, productId } = req.body;
  const testsData = [];

  try {
    if (testsInput && testsInput.length > 0) {
      const tests = await testDB.findMany({
        where: {
          id: {
            in: testsInput.map(({ id }) => id),
          },
        },
      });

      testsData.push(
        ...tests.map(({ id }) => ({
          testId: id,
          value: testsInput.find(({ id: testInputId }) => id === testInputId)?.value || 0,
        }))
      );
    }

    const product = await productDB.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.sendStatus(400);
    }

    if (testsData.length > 0) {
      testsOnRefillsDB.createMany({
        data: testsData.map((testData) => ({
          ...testData,
          refillId: +id,
        })),
      });
    }

    const updatedRefill = await refillDB.update({
      where: {
        id: +id,
      },
      ...(include?.length && {
        include: getInclude(include),
      }),
      data: {
        products: {
          create: [
            {
              product: {
                connect: {
                  id: productId,
                },
              },
            },
          ],
        },
      },
    });

    res.json(updatedRefill);
  } catch (error) {
    res.status(400).json(error);
  }
};
