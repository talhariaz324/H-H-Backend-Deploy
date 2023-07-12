import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomApiErrorHandler from '../utils/CustomApiErrorHandler';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  isAdmin: boolean;
  // Add other properties if necessary
}


export const authenticatedUser = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("🚀 ~ file: auth.ts:12 ~ authHeader:", authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new CustomApiErrorHandler('Unauthorized', StatusCodes.UNAUTHORIZED);
  }
  const token = authHeader.split(' ')[1];
  try {

    const {id, isAdmin}: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    console.log("🚀 ~ file: auth.ts:27 ~ id:", id)
    console.log("🚀 ~ file: auth.ts:18 ~ payload:", isAdmin)
    req.user = {id, isAdmin};
    next();
  } catch (error) {
    throw new CustomApiErrorHandler('Unauthorized', StatusCodes.UNAUTHORIZED);
  }
};
