import { query } from 'express-validator';

export const commonsValidations = [
  query('skip').isInt(),
  query('take').isInt(),
  query('sortByAsc').toArray(),
  query('sortByDesc').toArray(),
];
