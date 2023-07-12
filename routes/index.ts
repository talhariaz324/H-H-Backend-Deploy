import express from 'express';
import authRoutes from './authRoutes';
import paymentRoutes from './paymentRoutes'
import {
  default as groupRoutes,
} from './groupRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/group', groupRoutes);
router.use('/payment', paymentRoutes);

export default router;
