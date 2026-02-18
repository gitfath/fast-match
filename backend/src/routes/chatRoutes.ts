import { Router } from 'express';
import { getMyMatches, getMessages, sendMessage, deleteMessage } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/matches', getMyMatches);
router.get('/messages/:matchId', getMessages);
router.post('/messages', sendMessage);
router.delete('/messages/:messageId', deleteMessage);

export default router;
