import { Router } from 'express';
import { checkIn, checkOut, getAttendanceLogs } from '../controllers/attendanceController';

const router = Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/', getAttendanceLogs);

export default router;
