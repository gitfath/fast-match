import { Router } from 'express';
import {
    registerBusiness,
    searchPlaces,
    getPlaceById,
    createBooking,
    getBookings,
    getBusinessDashboard,
    updateBookingStatus
} from '../controllers/businessController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public / User Routes
router.post('/register', registerBusiness);
router.get('/search', authMiddleware, searchPlaces);
router.get('/place/:id', authMiddleware, getPlaceById);
router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings/my', authMiddleware, getBookings);

// Partner Routes
router.get('/dashboard', authMiddleware, getBusinessDashboard);
router.patch('/bookings/:id', authMiddleware, updateBookingStatus);

export default router;
