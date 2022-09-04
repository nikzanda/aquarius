import { Router } from 'express';
import { query, body } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as productController from '../controllers/product.controller';
import { commonsValidations } from '../helpers/queryValidations';

const router = Router();

router
  .route('')
  .get([...commonsValidations, query('name').isString().optional()], validate, productController.findAll)
  .post([body('categoryId').toInt()], validate, productController.create);

router.route('/:id').get(productController.findOne);

export default router;
