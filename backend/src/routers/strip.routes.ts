import { Router } from 'express';
import { body, query } from 'express-validator';
import { commonsValidations } from '../helpers/queryValidations';
import { validate } from '../middlewares/middlewares';
import * as stripController from '../controllers/strip.controller';

const router = Router();
const checkInclude = query('include').toArray().isIn(['tests']).optional();

router
  .route('')
  .get([...commonsValidations, checkInclude], validate, stripController.findAll)
  .post(
    [
      checkInclude,
      body('name').isString(),
      body('description').isString().optional(),
      body('productsIds').isArray().optional(),
    ],
    validate,
    stripController.create
  );

router
  .route('/:id')
  .get([checkInclude], stripController.findOne)
  .patch(
    [
      checkInclude,
      body('name').isString().optional(),
      body('description').isString().optional(),
      body('productsIds').isArray().optional(),
    ],
    validate,
    stripController.update
  )
  .delete(stripController.remove);

export default router;
