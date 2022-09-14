import { Router } from 'express';
import { body, query } from 'express-validator';
import { commonsValidations } from '../helpers/queryValidations';
import { validate } from '../middlewares/middlewares';
import * as testController from '../controllers/test.controller';

const router = Router();
const checkInclude = query('include').toArray().isIn(['strips']).optional();

router
  .route('')
  .get([...commonsValidations, checkInclude], validate, testController.findAll)
  .post(
    [body('name').isString(), body('minLevel').isInt().optional(), body('maxLevel').isInt().optional()],
    validate,
    testController.create
  );

router
  .route('/:id')
  .get(testController.findOne)
  .patch(
    [body('name').isString().optional(), body('minLevel').isInt().optional(), body('maxLevel').isInt().optional()],
    validate,
    testController.update
  )
  .delete(testController.remove);

export default router;
