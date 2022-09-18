import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as refillController from '../controllers/refill.controller';
import { commonsValidations } from '../helpers/queryValidations';

const router = Router();
const checkInclude = query('include').toArray().isIn(['products', 'tests']).optional();

router
  .route('')
  .get([...commonsValidations, checkInclude], validate, refillController.findAll)
  .post(
    [checkInclude, body('tests').isArray().optional(), body('productsIds').isArray().optional()],
    validate,
    refillController.create
  );

router.get('/last', refillController.findLast);

router
  .route('/:id')
  .get([checkInclude], validate, refillController.findOne)
  .patch(
    [checkInclude, body('tests').isArray().optional(), body('productId').isInt().optional()],
    validate,
    refillController.update
  );

export default router;
