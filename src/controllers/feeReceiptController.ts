import { NextFunction, Request, Response } from 'express';
import FeeReceipt from '../models/feeReceipt';
import catchAsync from '../utils/catchAsync';
import handleFactory from './handleFactory';

const getAllFeeReceipt = handleFactory.getAll(FeeReceipt);
const getFeeReceipt = handleFactory.getOne(FeeReceipt);
const createFeeReceipt = handleFactory.createOne(FeeReceipt);
const updateFeeReceipt = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    message: 'This route is not defined. Please use another route'
  });
});
const deleteFeeReceipt = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    message: 'This route is not defined. Please use another route'
  });
});

export default {
  getAllFeeReceipt,
  getFeeReceipt,
  updateFeeReceipt,
  createFeeReceipt,
  deleteFeeReceipt
};
