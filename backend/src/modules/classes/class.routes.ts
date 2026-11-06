import { Router } from 'express';
import * as controller from './class.controller';

const router = Router();

router.get('/', controller.index);
router.post('/', controller.store);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleted);

export default router;
