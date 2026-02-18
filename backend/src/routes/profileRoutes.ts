import { Router } from 'express';
import { createProfile, getMyProfile, updateProfile, deleteProfile } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createProfile);
router.get('/me', getMyProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

export default router;
