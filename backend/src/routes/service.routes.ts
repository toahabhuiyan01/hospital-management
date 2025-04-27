import express from 'express';
import { getAllServices, getServiceById, getServicesByHospital } from '../controllers/service.controller';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.get('/hospital/:hospitalId', getServicesByHospital);

export default router;