import { Router } from 'express';
import { query } from 'express-validator';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/middlewares';

const router = Router();

router.get(
  '',
  [
    query('skip').isInt(),
    query('take').isInt(),
    query('name').isString().optional(),
    query('optional').isBoolean().optional(),
    query('include').isIn(['filters']).optional(),
    query('sortByAsc').toArray(),
    query('sortByDesc').toArray(),
  ],
  validate,
  categoryController.findAll
);
router.get('/:id', categoryController.findOne);

export default router;
