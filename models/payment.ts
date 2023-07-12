import mongoose from 'mongoose';
import { PAYMENT_REASON, PaymentData } from '../dtos/payment';

const paymentSchema = new mongoose.Schema<PaymentData>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  groupId: {
    type: mongoose.Types.ObjectId,
    ref: 'Group',
  },
  transactionId: {
      type: String,
  },
  amount:{
    type: String,
    required: true
  },
  // TODO : Abdul Rehman
  paymentReason: {
    type: String,
    enum: Object.values(PAYMENT_REASON),
    default: PAYMENT_REASON.Death,
  },
  email: {
    type: String,
    unqiue: true,
  }
});

export default mongoose.model('Payment', paymentSchema);
