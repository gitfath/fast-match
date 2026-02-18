import { Router } from 'express';
import {
    getStats, getRecentActivity, getAllUsers, getUserDetail, updateUserStatus,
    createSanction, deleteUser, getAllReports, updateReportStatus,
    getAllTransactions, getAllTickets, getAllBusinesses, verifyBusiness
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';


const router = Router();

router.use(authMiddleware);
router.use(isAdmin);

router.get('/stats', getStats);
router.get('/activity', getRecentActivity);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetail);
router.put('/users/:userId', updateUserStatus);
router.post('/users/:userId/sanction', createSanction);
router.delete('/users/:userId', deleteUser);
router.get('/reports', getAllReports);
router.put('/reports/:reportId', updateReportStatus);
router.get('/transactions', getAllTransactions);
router.get('/tickets', getAllTickets);
router.get('/businesses', getAllBusinesses);
router.put('/businesses/:businessId', verifyBusiness);


export default router;
