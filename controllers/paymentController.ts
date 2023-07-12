import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import BigNumber from 'json-bigint';
import { v4 as uuidv4 } from 'uuid';
import squareClient from '../config/square';
import Payment from '../models/payment';
import CustomApiErrorHandler from '../utils/CustomApiErrorHandler';

export const getIndividualPayment = async (req: Request, res: Response) => {
  const { id } = req.user;
  const payment = await Payment.find({ userId: id });
  if (payment.length === 0)
    throw new CustomApiErrorHandler('No Payments found!', 400);
  res.status(StatusCodes.OK).json(payment);
};
export const getGroupPayment = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const payment = await Payment.find({ groupId });
  if (payment.length === 0)
    throw new CustomApiErrorHandler('No Payments found!', 400);
  res.status(StatusCodes.OK).json(payment);
};

// create Payment
export const createPayment = async (req: Request, res: Response) => {
  const payment = await Payment.create(req.body);
  res.status(StatusCodes.CREATED).json(payment);
};

//Total Amount
export const totalAmount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const groupPayment = await Payment.find({ groupId: id });
  console.log("🚀 ~ file: paymentController.ts:32 ~ totalAmount ~ groupPayment:", groupPayment)
  const userPayment = await Payment.find({ userId: id });

  if (groupPayment || userPayment) {
    const totalAmount = groupPayment
      ? groupPayment
          .map((transaction) => parseFloat(transaction.amount))
          .reduce((total, amount) => total + amount, 0)
          : userPayment
          .map((transaction) => parseFloat(transaction.amount))
          .reduce((total, amount) => total + amount, 0);

    res.status(StatusCodes.CREATED).json(totalAmount);
  }
  throw new CustomApiErrorHandler('No Payment Found', 400);
};
    
// Square Payment
export const squarePayment = async (req: Request, res: Response) => {
  try {
    const { sourceId, amount } = req.body;
    const {
      result: { payment },
    } = await squareClient.paymentsApi.createPayment({
      sourceId,
      amountMoney: {
        amount: amount,
        currency: 'USD',
      },
      idempotencyKey: uuidv4(),
    });

    res.send(BigNumber.stringify(payment));
  } catch (error) {
    res.status(400).json(error);
  }
};