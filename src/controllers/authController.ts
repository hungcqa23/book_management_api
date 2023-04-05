import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import AppError from '../utils/appError';

const signToken = (id: String) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'DEFAULT_SECRET', {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(user._id);
  const expiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 1;
  const cookieOptions = {
    expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.cookie('jwt', token);

  // Remove the password:
  user.password = '';

  // Send the JWT token as part of the response body
  res.status(statusCode || 200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, passwordConfirm, role } = req.body;
  const user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    role
  });

  createSendToken(user, 201, res);
});

const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const user = await User.findById(req.params.id);
  let avatar_url: string | undefined = undefined;
  if (user?.avatar) {
    avatar_url = `${req.protocol}://${req.get('host')}/api/v1/users/${id}/avatar`;
  }
  res.status(200).json({
    avatar_url,
    data: {
      avatar_url,
      user
    }
  });
});

export default {
  signUp,
  getUser,
  getMe
};
