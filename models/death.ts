import mongoose from 'mongoose';

const deathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('PendingPayment', deathSchema);
