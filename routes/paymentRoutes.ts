import express from 'express';

import {
  createPayment,
  getGroupPayment,
  getIndividualPayment,
  squarePayment,
  totalAmount,
} from '../controllers/paymentController';
import { authenticatedUser } from '../middlewares/auth';

const router = express.Router();

router
  .route('/individual-payment')
  .get(authenticatedUser, getIndividualPayment);

router.route('/total-amount/:id').get(totalAmount);
router.route('/create-payment').post(createPayment);
router.route('/group/:groupId').get(getGroupPayment);
router.route('/square/pay').post(squarePayment);

export default router;
