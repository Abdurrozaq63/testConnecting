import { Router } from 'express';
import * as controller from './teacher.controller';

const router = Router();

router.get('/all', controller.indexAll);
router.get('/', controller.index);
router.post('/', controller.store);
router.delete('/:id', controller.deleted);
router.put('/:id', controller.update);

export default router;
