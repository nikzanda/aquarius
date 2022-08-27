import { Router } from 'express';
import { body, query } from 'express-validator';
import * as filterController from '../controllers/filter.controller';
import { validate } from '../middlewares/middlewares';

const router = Router();

router
  .route('')
  .get(
    [
      query('skip').isInt(),
      query('take').isInt(),
      query('categoryId').isInt().optional(),
      query('isActive').isBoolean().optional(),
    ],
    validate,
    filterController.findAll
  )
  .post([body('categoryId').toInt()], validate, filterController.create);

router.route('/:id').get(filterController.findOne).patch(filterController.update);

export default router;
