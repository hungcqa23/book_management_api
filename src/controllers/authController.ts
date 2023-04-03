import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import fs from 'fs';

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
  const { name, email, password, passwordConfirm, role } = req.body;
  const photo = fs.readFileSync(`${__dirname}/../data/img/default-user.png`);
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    photo
  });

  createSendToken(user, 201, res);
});

export default {
  signUp
};
