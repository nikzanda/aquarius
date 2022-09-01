import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middlewares/middlewares';
import * as refillController from '../controllers/refill.controller';

const router = Router();

router
  .route('')
  .get(
    [query('skip').isInt(), query('take').isInt(), query('sortByAsc').toArray(), query('sortByDesc').toArray()],
    validate,
    refillController.findAll
  )
  .post([body('productsIds').isArray().optional(), validate, refillController.create]);

router.route('/:id').get(refillController.findOne);

export default router;
