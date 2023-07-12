/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from 'mongoose';

export interface GroupData extends Document {
  associationName: string;
  registeredMembers: number;
  registrationNumber: string;
  address: string;
  zipCode: number;
  country: string;
  phoneNumbers: any;
  email: string;
  websiteLink: string;
  accountStatus: ACCOUNT_STATUS;
  createJWT(): string;
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'active',
  SUSPEND = 'suspend',
  PENDING = 'pending',
  DEAD = 'dead', // Reason FOR THIS
}