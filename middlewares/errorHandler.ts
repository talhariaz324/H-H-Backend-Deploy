/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'There was an error, try again later',
  };
  //  validation Error(empty fields)
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .map((msg) => msg.replace('Path ', ''))[0];
  }
  //  mongoose duplicate email error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} must be unqiue`;
  }

  res.status(defaultError.statusCode).json({
    msg: defaultError.msg,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
  next();
};
