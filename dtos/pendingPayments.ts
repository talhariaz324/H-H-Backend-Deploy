import mongoose, { Document } from 'mongoose';

export interface PendingPaymentData extends Document {
  deathUserId: mongoose.Types.ObjectId | undefined;
  amount: number;
  remaningTime: string
}