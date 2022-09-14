import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { FindAllResponse, QueryParamId, TypedRequestBody, TypedRequestQuery, TypedResponse } from '../types/commons';
import { TestCreateBody, TestQuery, TestUpdateBody } from '../types/test';

const { test: testDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<TestQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, sortByAsc, sortByDesc, name } = req.query;

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
      where,
      // TODO: aggiungere include nella query
    }),
    testDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const test = await testDB.findUnique({
    where: {
      id: +id,
    },
  });

  res.json(test);
};

export const create = async (req: TypedRequestBody<TestCreateBody>, res: Response) => {
  const { name, minLevel, maxLevel } = req.body;

  try {
    const newTest = await testDB.create({
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

export const update = async (req: Request<QueryParamId, unknown, TestUpdateBody>, res: Response) => {
  const { id } = req.params;
  const { name, minLevel, maxLevel } = req.body;

  try {
    const updatedTest = await testDB.update({
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
};
