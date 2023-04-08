import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { AuthRequest } from './authController';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

const getUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = User.find({ _id: req.user.id });
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export default { getAllUsers, getUser };
