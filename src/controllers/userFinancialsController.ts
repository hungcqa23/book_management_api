import { NextFunction, Response } from 'express';
import { AuthRequest } from '../interfaces/model.interfaces';
import UserFinancials from '../models/userFinancials';
import handleFactory from './handleFactory';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const getAllUserFinancials = handleFactory.getAll(UserFinancials);
const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userFinancials = await UserFinancials.findOne({ user: req.user.id });
  if (!userFinancials) {
    return next(new AppError(`Not found user financials. Please create a new one!`, 404));
  }
  res.status(200).json({
    status: 'success',
    userFinancials
  });
});

export default {
  getAllUserFinancials,
  getMe
};
