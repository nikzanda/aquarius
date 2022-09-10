import { Router } from 'express';
import { query } from 'express-validator';
import * as categoryController from '../controllers/category.controller';
import { commonsValidations } from '../helpers/queryValidations';
import { validate } from '../middlewares/middlewares';

const router = Router();
const checkInclude = query('include').toArray().isIn(['filters']).optional();

router.get(
  '',
  [...commonsValidations, query('name').isString().optional(), query('optional').isBoolean().optional(), checkInclude],
  validate,
  categoryController.findAll
);
router.get('/:id', [checkInclude], validate, categoryController.findOne);

export default router;
