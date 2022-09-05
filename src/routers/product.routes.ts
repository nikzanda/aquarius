import { Router } from 'express';
import { query, body } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as productController from '../controllers/product.controller';
import { commonsValidations } from '../helpers/queryValidations';
import { ProductCategory } from '.prisma/client';

const router = Router();

router
  .route('')
  .get([...commonsValidations, query('name').isString().optional()], validate, productController.findAll)
  .post(
    [
      body('name').isString(),
      body('category').isIn(Object.keys(ProductCategory)),
      body('quantity').isString().optional(),
      body('frequencyInDays').isInt().optional(), // TODO: required if...
      body('useWhenRefilling').isBoolean(),
    ],
    validate,
    productController.create
  );

router.route('/:id').get(productController.findOne);

export default router;
