import mongoose, { Document } from 'mongoose';

export interface UserData extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  address: string;
  zipCode: number;
  phoneNumbers: {
    Home: string;
    Cell: string;
  };
  identification: {
    identificationType: IDENTIFICATION_TYPE;
    number: string;
    countryOfIssuance: string;
    placedIssuance: string;
    dateOfIssuance: string;
    expiryDate: string;
  };
  nationalIdentity: string;
  passport: string;
  driverLisence: string;
  countryOfIssuance: string;
  placedIssuance: string;
  dateOfIssuance: string;
  expiryDate: string;
  relationshipOfKin: string;
  groupName: string;
  positionOccupied: string;
  isGroupAdmin: boolean;
  isIndividualAdmin: boolean;
  isGroupRespresentative: boolean;
  isVerified: boolean;
  isKin: boolean;
  accountStatus: ACCOUNT_STATUS;
  // groupId: mongoose.Types.ObjectId | undefined;
  groupId: string;
  individualAdminId: mongoose.Types.ObjectId | undefined;
  registrationNo: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'active',
  SUSPEND = 'suspend',
  PENDING = 'pending',
  DEAD = 'dead', // Reason FOR THIS
}

export enum IDENTIFICATION_TYPE {
  NATIONALIDENTITY = 'nationalIdentity',
  PASSPORD = 'passport',
  DRIVERLISENCE = 'driverLisence',
}

export type UserInput = Pick<
  UserData,
  'firstName' | 'lastName' | 'email' | 'password' | 'middleName'
>;
export type UserLoginInput = Pick<UserInput, 'email' | 'password'>;
