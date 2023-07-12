import mongoose, { Document } from 'mongoose';

export interface PaymentData extends Document {
  userId: mongoose.Types.ObjectId | undefined;
  groupId: mongoose.Types.ObjectId | undefined;
  transactionId: string;
  amount: string;
  email: string;
  paymentReason: PAYMENT_REASON
}


export enum PAYMENT_REASON {
    Death = 'Death',
    HEALTH = 'Healt',
    EDUCATION = 'Education',
    REGISTRATION ='Registration'
  }
  


