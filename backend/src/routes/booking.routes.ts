import express from 'express';
import { createBooking, getUserBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.patch('/:id', updateBookingStatus);

export default router;