import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.post('/', controller.createRequest);
router.get('/', controller.listRequests);
router.get('/:id', controller.getRequest);
router.patch('/:id/status', controller.updateRequestStatus);

export default router;
