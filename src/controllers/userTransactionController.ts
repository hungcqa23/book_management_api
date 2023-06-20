import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import UserTransaction from '../models/userTransaction';
import { AuthRequest, IUserFinancials, IUserTransaction } from '../interfaces/model.interfaces';
import UserFinancials from '../models/userFinancials';

const updateStatusTransaction = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.query.status || !req.query.user) {
      return next(new AppError(`Transaction not found`, 404));
    }

    const { status, user } = req.query;
    console.log(user);
    if (req.user.id != user) {
      return next(new AppError(`Transaction doesn't belong to this user`, 400));
    }
    const userFinancials: IUserFinancials | null = await UserFinancials.findById(user);
    if (!userFinancials) {
      return next(new AppError(`Please create a User Financials!`));
    }

    const updatedTransaction: IUserTransaction | null = await UserTransaction.findOne({
      userFinancials: userFinancials.id
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
