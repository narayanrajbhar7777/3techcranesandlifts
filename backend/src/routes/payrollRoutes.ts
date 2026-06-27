import { Router } from 'express';
import { generatePayslip, getPayslips } from '../controllers/payrollController';

const router = Router();

router.post('/', generatePayslip);
router.get('/', getPayslips);

export default router;
