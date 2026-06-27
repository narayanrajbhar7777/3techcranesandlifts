import { Router } from 'express';
import { applyLeave, getLeaveRequests, updateLeaveStatus } from '../controllers/leaveController';

const router = Router();

router.post('/', applyLeave);
router.get('/', getLeaveRequests);
router.patch('/:id/status', updateLeaveStatus);

export default router;
