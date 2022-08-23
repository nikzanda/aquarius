import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.get('', categoryController.findAll);
router.get('/:id', categoryController.findOne);

export default router;
