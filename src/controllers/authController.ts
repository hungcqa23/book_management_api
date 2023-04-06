import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import Email from '../utils/email';
import { promisify } from 'util';
import { Token } from 'nodemailer/lib/xoauth2';

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

  res.cookie('jwt', token, cookieOptions);

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

  const url = `${req.protocol}://${req.get('host')}/api/v1/users/me`;
  // Don't block email
  new Email(user, url).sendWelcome();

  createSendToken(user, 201, res);
});

const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`Please provide email or password`, 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user?.password))) {
    return next(new AppError('Incorrect password or email', 401));
  }

  createSendToken(user, 200, res);
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

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: any;
}

const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Get token and check if it exits
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError(`You're not logged in! Please log in to access this page`, 403));
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded: TokenPayload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    // 2) Check if user still exists
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError(`The user belonging to this token does no longer exist.`, 401));
    }
    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(`Invalid token. Please log in again.`, 401));
  }
});

export default {
  signUp,
  getUser,
  getMe,
  logIn,
  protect
};
