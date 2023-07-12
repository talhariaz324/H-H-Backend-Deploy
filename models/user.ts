import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ACCOUNT_STATUS, IDENTIFICATION_TYPE, UserData } from '../dtos/user';

const UserSchema = new mongoose.Schema<UserData>({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  middleName: {
    type: String,
    minlength: 3,
    maxlength: 25,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  password: {
    type: String,
    // required: true,
    minlength: 3,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email address',
    },
  },
  dateOfBirth: {
    type: String,
  },
  placeOfBirth: {
    type: String,
  },
  nationality: {
    type: String,
  },
  countryOfResidence: {
    type: String,
  },
  address: String,
  zipCode: {
    type: Number,

    min: 5,
  },
  phoneNumbers: {
    Home: {
      type: String,
    },
    Cell: {
      type: String,
    },
  },
  identification: {
    identificationType: {
      type: String,
      enum: Object.values(IDENTIFICATION_TYPE),
    },
    number: {
      type: String,
    },
    countryOfIssuance: {
      type: String,
    },
    placedIssuance: {
      type: String,
    },
    dateOfIssuance: {
      type: String,
    },
    expiryDate: {
      type: String,
    },
  },
  // nationalIdentity: {
  //   type: String,
  // },
  // passport: {
  //   type: String,
  // },
  // driverLisence: {
  //   type: String,
  // },
  // countryOfIssuance: {
  //   type: String,
  // },
  // placedIssuance: {
  //   type: String,
  // },
  // dateOfIssuance: {
  //   type: String,
  // },
  // expiryDate: {
  //   type: String,
  // },
  // groupId: {
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Group',
  // },
  groupId: {
    type: String,
  },
  relationshipOfKin: {
    type: String,
  },
  positionOccupied: {
    type: String,
  },
  isGroupAdmin: {
    type: Boolean,
    default: false,
  },

  isIndividualAdmin: {
    type: Boolean,
    default: false,
  },
  isGroupRespresentative: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // PAICHIDA
  // isKin:{
  //   type: Boolean,
  //   default: false
  // },
  accountStatus: {
    type: String,
    enum: Object.values(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.PENDING,
  },
  individualAdminId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  registrationNo: {
    type: String,
  },
});

//  hash the password;
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id, isAdmin: this.toJSON().isAdmin }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
};

UserSchema.methods.comparePassword = async function (
  this: UserData,
  candidatePassword: string
) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<UserData>('User', UserSchema);
