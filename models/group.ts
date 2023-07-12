import mongoose from 'mongoose';
import { GroupData, ACCOUNT_STATUS } from '../dtos/group';
import jwt from 'jsonwebtoken';

const groupSchema = new mongoose.Schema<GroupData>({
  associationName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },

  registeredMembers: {
    type: Number,
    required: true,
  },

  accountStatus: {
    type: String,
    enum: Object.values(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.PENDING,
  },

  registrationNumber: {
    type: String,
  },
  address: String,
  zipCode: {
    type: Number,
    required: true,
    min: 5,
  },
  country: {
    type: String,
    required: true,
    minlength: 3,
  },
  phoneNumbers: {
    type: Array,
  },
  email: {
    type: String,
    unqiue: true,
    required: true,
  },
  websiteLink: {
    type: String,
  },
});

groupSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
};

export default mongoose.model('Group', groupSchema);
