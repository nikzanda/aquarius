import { Request, Response } from 'express';
import { getInclude } from '../helpers/strip';
import { TypedRequestQuery, TypedResponse, FindAllResponse, QueryParamId } from '../types/commons';
import { StripQuery, StripCreateBody, StripUpdateBody, Include } from '../types/strip';
import client from '../../prisma/index';

const { strip: stripDB, test: testDB } = client;

export const findAll = async (req: TypedRequestQuery<StripQuery>, res: TypedResponse<FindAllResponse>) => {
  const { skip, take, include, sortByAsc, sortByDesc, name } = req.query;

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
      ...(include?.length && {
        include: getInclude(include),
      }),
    }),
    stripDB.count({ where }),
  ]);

  res.json({
    result,
    count,
  });
};

export const findOne = async (req: Request<QueryParamId, unknown, unknown, { include: Include[] }>, res: Response) => {
  const { id } = req.params;
  const { include } = req.query;

  const strip = await stripDB.findUnique({
    ...(include?.length && {
      include: getInclude(include),
    }),
    where: {
      id: +id,
    },
  });

  res.json(strip);
};

export const create = async (
  req: Request<unknown, unknown, StripCreateBody, { include: Include[] }>,
  res: Response
) => {
  const { include } = req.query;
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
      ...(include?.length && {
        include: getInclude(include),
      }),
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

export const update = async (
  req: Request<QueryParamId, unknown, StripUpdateBody, { include: Include[] }>,
  res: Response
) => {
  const { id } = req.params;
  const { include } = req.query;
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
      ...(include?.length && {
        include: getInclude(include),
      }),
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

  try {
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
  } catch (error) {
    res.status(400).json(error);
  }
};
