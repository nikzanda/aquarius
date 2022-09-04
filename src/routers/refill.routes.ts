import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as refillController from '../controllers/refill.controller';
import { commonsValidations } from '../helpers/queryValidations';

const router = Router();
const checkInclude = query('include').toArray().isIn(['products']).optional();

router
  .route('')
  .get([...commonsValidations, checkInclude], validate, refillController.findAll)
  .post([body('productsIds').isArray().optional(), validate, refillController.create]);

router.route('/:id').get([checkInclude], validate, refillController.findOne);

export default router;
