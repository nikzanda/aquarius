import { Router } from 'express';
import * as filterController from '../controllers/filter.controller';

const router = Router();

router.get('/', filterController.findAll);

export default router;