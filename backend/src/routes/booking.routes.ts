import express from 'express';
import { createBooking, getBookingByHospital, getUserBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.patch('/:id', updateBookingStatus);
router.get('/hospitals/:hospitalId', getBookingByHospital)

export default router;