import { Router } from 'express';
import { body, query } from 'express-validator';
import * as filterController from '../controllers/filter.controller';
import { validate } from '../middlewares/middlewares';

const router = Router();

router.get(
  '',
  [
    query('skip').isInt(),
    query('take').isInt(),
    query('categoryId').isInt().optional(),
    query('isActive').isBoolean().optional(),
  ],
  validate,
  filterController.findAll
);
router.get('/:id', filterController.findOne);
router.post('', [body('categoryId').toInt()], validate, filterController.create);

export default router;
