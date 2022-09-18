import { Request, Response } from 'express';
import { getInclude } from '../helpers/test';
import { FindAllResponse, QueryParamId, TypedRequestQuery, TypedResponse } from '../types/commons';
import { Include, TestCreateBody, TestQuery, TestUpdateBody } from '../types/test';
import client from '../../prisma/index';

const { test: testDB } = client;

export const findAll = async (req: TypedRequestQuery<TestQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, include, sortByAsc, sortByDesc, name } = req.query;

  const where = {
    ...(name && { name: { search: name } }),
  };

  const [result, count] = await Promise.all([
    testDB.findMany({
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
    testDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId, unknown, unknown, { include: Include[] }>, res: Response) => {
  const { id } = req.params;
  const { include } = req.query;

  const test = await testDB.findUnique({
    ...(include?.length && {
      include: getInclude(include),
    }),
    where: {
      id: +id,
    },
  });

  res.json(test);
};

export const create = async (req: Request<unknown, unknown, TestCreateBody, { include: Include[] }>, res: Response) => {
  const { include } = req.query;
  const { name, minLevel, maxLevel } = req.body;

  try {
    const newTest = await testDB.create({
      ...(include?.length && {
        include: getInclude(include),
      }),
      data: {
        name,
        minLevel,
        maxLevel,
      },
    });

    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const update = async (
  req: Request<QueryParamId, unknown, TestUpdateBody, { include: Include[] }>,
  res: Response
) => {
  const { id } = req.params;
  const { include } = req.query;
  const { name, minLevel, maxLevel } = req.body;

  try {
    const updatedTest = await testDB.update({
      ...(include?.length && {
        include: getInclude(include),
      }),
      where: {
        id: +id,
      },
      data: {
        ...(name && { name }),
        ...(minLevel && { minLevel }),
        ...(maxLevel && { maxLevel }),
      },
    });

    res.json(updatedTest);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const remove = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  try {
    const test = await testDB.findUnique({
      where: {
        id: +id,
      },
    });

    if (!test) {
      return res.sendStatus(404);
    }

    await testDB.delete({
      where: {
        id: +id,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(400).json(error);
  }
};
