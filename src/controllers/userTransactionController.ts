import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { AuthRequest } from './authController';
import UserTransaction, { IUserTransaction } from '../models/userTransactionModel';

const updateStatusTransaction = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.query.status || !req.query.user) {
      return next(new AppError(`Transaction not found`, 404));
    }

    const { status, user } = req.body;

    if (req.user.id != user) {
      return next(new AppError(`Transaction doesn't belong to this user`, 400));
    }

    const updatedTransaction: IUserTransaction | null = await UserTransaction.findOne({
      user,
      createdAt: {
        $lte: Date.now() - 3000
      }
    });
    if (!updatedTransaction) {
      return next(new AppError(`Not found user transaction!`));
    }

    updatedTransaction.status = 'success';
    updatedTransaction.save();

    res.status(200).json({
      status,
      date: updatedTransaction
    });
  }
);

export default { updateStatusTransaction };