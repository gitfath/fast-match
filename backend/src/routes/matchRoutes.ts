import { Router } from 'express';
import { getRecommendations, swipe } from '../controllers/matchController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/recommendations', getRecommendations);
router.post('/swipe', swipe);

export default router;
