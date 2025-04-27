import express from 'express';
import { getAllHospitals, getHospitalById } from '../controllers/hospital.controller';

const router = express.Router();

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);

export default router;