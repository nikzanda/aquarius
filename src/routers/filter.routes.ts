import { Router } from 'express';
import { body, query } from 'express-validator';
import * as filterController from '../controllers/filter.controller';
import { commonsValidations } from '../helpers/queryValidations';
import { validate } from '../middlewares/middlewares';

const router = Router();
const checkInclude = query('include').toArray().isIn(['category']).optional();

router
  .route('')
  .get(
    [
      ...commonsValidations,
      query('categoryId').isInt().optional(),
      query('isActive').isBoolean().optional(),
      checkInclude,
    ],
    validate,
    filterController.findAll
  )
  .post([body('categoryId').toInt()], validate, filterController.create);

router.route('/:id').get([checkInclude], validate, filterController.findOne).delete(filterController.remove);

export default router;
