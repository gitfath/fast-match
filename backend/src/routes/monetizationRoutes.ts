import { Router } from 'express';
import { getBalance, getTransactions, withdrawGains, claimReferral } from '../controllers/monetizationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/balance', authMiddleware, getBalance);
router.get('/transactions', authMiddleware, getTransactions);
router.post('/withdraw', authMiddleware, withdrawGains);
router.post('/referral/claim', authMiddleware, claimReferral);

export default router;
