import { Router } from 'express';
import { body } from 'express-validator';
import * as filterController from '../controllers/filter.controller';
import { validate } from '../middlewares/middlewares';

const router = Router();

router.get('', filterController.findAll);
router.get('/:id', filterController.findOne);
router.post('', [body('categoryId').toInt()], validate, filterController.create);

export default router;
