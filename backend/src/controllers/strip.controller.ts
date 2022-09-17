import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { TypedRequestQuery, TypedResponse, FindAllResponse, QueryParamId, TypedRequestBody } from '../types/commons';
import { StripQuery, StripCreateBody, StripUpdateBody } from '../types/strip';

const { strip: stripDB, test: testDB } = new PrismaClient();

export const findAll = async (req: TypedRequestQuery<StripQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, sortByAsc, sortByDesc, name } = req.query;

  const where = {
    ...(name && { name: { search: name } }),
  };

  const [result, count] = await Promise.all([
    stripDB.findMany({
      skip: +skip,
      ...(+take > 0 && { take: +take }),
      orderBy: [
        ...(sortByAsc?.length ? sortByAsc.map((field) => ({ [field]: 'asc' })) : []),
        ...(sortByDesc?.length ? sortByDesc.map((field) => ({ [field]: 'desc' })) : []),
      ],
      where,
      // TODO: aggiungere include nella query
      include: {
        tests: {
          include: {
            test: true,
          },
        },
      },
    }),
    stripDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const strip = await stripDB.findUnique({
    where: {
      id: +id,
    },
    include: {
      tests: {
        include: {
          test: true,
        },
      },
    },
  });

  res.json(strip);
};

export const create = async (req: TypedRequestBody<StripCreateBody>, res: Response) => {
  const { name, description, testsIds } = req.body;
  const tests = [];

  try {
    if (testsIds && testsIds.length > 0) {
      tests.push(
        ...(await testDB.findMany({
          where: {
            id: {
              in: testsIds,
            },
          },
        }))
      );
    }

    const newStrip = await stripDB.create({
      data: {
        name,
        description,
        tests: {
          create: [
            ...tests.map(({ id }) => ({
              test: { connect: { id } },
            })),
          ],
        },
      },
    });

    res.status(201).json(newStrip);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const update = async (req: Request<QueryParamId, unknown, StripUpdateBody>, res: Response) => {
  const { id } = req.params;
  const { name, description, testsIds } = req.body;

  const tests = [];

  try {
    if (testsIds && testsIds.length > 0) {
      tests.push(
        ...(await testDB.findMany({
          where: {
            id: {
              in: testsIds,
            },
          },
        }))
      );
    }

    const updatedStrip = await stripDB.update({
      where: {
        id: +id,
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        tests: {
          deleteMany: {},
          create: [
            ...tests.map(({ id }) => ({
              test: { connect: { id } },
            })),
          ],
        },
      },
    });

    res.json(updatedStrip);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const remove = async (req: Request<QueryParamId>, res: Response) => {
  const { id } = req.params;

  const strip = await stripDB.findUnique({
    where: {
      id: +id,
    },
  });

  if (!strip) {
    return res.sendStatus(404);
  }

  await stripDB.delete({
    where: {
      id: +id,
    },
  });

  res.sendStatus(204);
};
