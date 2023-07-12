import mongoose from 'mongoose';

const pendingPaymentSchema = new mongoose.Schema({
  deathUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Death',
  },
  amount: {
    type: Number,
    required: true,
  },
  remaningTime: {
    type: String,
  },
});

export default mongoose.model('PendingPayment', pendingPaymentSchema);
