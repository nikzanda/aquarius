import { Router } from 'express';
import { query, body } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as productController from '../controllers/product.controller';
import { commonsValidations } from '../helpers/queryValidations';
import { ProductCategory } from '.prisma/client';

const router = Router();
const checkInclude = query('include').toArray().isIn(['refills']).optional();

router
  .route('')
  .get([...commonsValidations, query('name').isString().optional(), checkInclude], validate, productController.findAll)
  .post(
    [
      checkInclude,
      body('name').isString(),
      body('category').isIn(Object.keys(ProductCategory)),
      body('quantity').isString().optional(),
      body('frequencyInDays').isInt().optional(), // TODO: required if...
      body('useWhenRefilling').isBoolean(),
    ],
    validate,
    productController.create
  );

router
  .route('/:id')
  .get([checkInclude], productController.findOne)
  .patch(
    [
      checkInclude,
      body('name').isString().optional(),
      body('category').isIn(Object.keys(ProductCategory)).optional(),
      body('quantity').isString().optional(),
      body('frequencyInDays').isInt().optional(), // TODO: required if...
      body('useWhenRefilling').isBoolean().optional(),
    ],
    validate,
    productController.update
  )
  .delete(productController.remove);

export default router;
