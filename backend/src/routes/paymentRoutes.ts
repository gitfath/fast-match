import { Router } from 'express';
import { initiatePayment, handleCallback, getPaymentHistory } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/initiate', authMiddleware, initiatePayment);
router.post('/callback', handleCallback);
router.get('/history', authMiddleware, getPaymentHistory);

export default router;
