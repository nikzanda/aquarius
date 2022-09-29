import { Request, Response } from 'express';
import { getInclude } from '../helpers/refill';
import { FindAllResponse, QueryParamId, TypedRequestQuery, TypedResponse } from '../types/commons';
import { Include, RefillQuery, RefillUpdateBody } from '../types/refill';
import client from '../../prisma/index';
import { Product, ProductsOnRefills } from '@prisma/client';

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
  req: Request<unknown, unknown, unknown, { include: Include[] }>,
  res: Response
) => {
  const { include } = req.query;

  type ProductsOnRefillsWithProduct = ProductsOnRefills & { product: Product }

  try {
    const productsOnRefills: ProductsOnRefillsWithProduct[] = [];
    const lastRefill = await refillDB.findFirst({
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: {
          include: {
            product: true,
          },
          where: {
            product: {
              useWhenRefilling: false,
            }
          }
        },
      },
    });

    if (lastRefill?.products.length) {
      productsOnRefills.push(...lastRefill.products
        .sort(({ createdAt: dateA }, { createdAt: dateB }) => dateB.getTime() - dateA.getTime())
        .reduce((acc, productOnRefill) => {
          if (!acc.some(({ product: { id } }) => id === productOnRefill.product.id)) {
            acc.push(productOnRefill);
          }
          return acc;
        }, [] as ProductsOnRefillsWithProduct[])
      );
    }

    const newRefill = await refillDB.create({
      ...(include?.length && {
        include: getInclude(include),
      }),
      data: {
        products: {
          create: [
            ...productsOnRefills.map(({ product: { id: productId }, createdAt }) => ({
              product: { connect: { id: productId } },
              createdAt,
            })),
          ],
        },
      },
    });

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

    if (typeof productId === 'number') {
      const product = await productDB.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.sendStatus(400);
      }
    }

    if (testsData.length > 0) {
      await testsOnRefillsDB.createMany({
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
        ...(productId && {
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
        }),
      },
    });

    res.json(updatedRefill);
  } catch (error) {
    res.status(400).json(error);
  }
};
