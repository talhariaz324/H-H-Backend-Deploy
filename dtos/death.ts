import mongoose, { Document } from 'mongoose';

export interface  DeathData extends Document {
  userId: mongoose.Types.ObjectId | undefined;
}