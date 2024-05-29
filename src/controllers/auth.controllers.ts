import catchAsync from '../utils/catch-async';
import { Request, Response, NextFunction } from 'express';
import User from '../models/schemas/user';
import jwt from 'jsonwebtoken';
import AppError from '../utils/app-error';
import Email from '../utils/email';
import crypto from 'crypto';
import { AuthRequest, IUser } from '../models/interfaces/model.interfaces';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { signToken } from '../utils/jwt';
import UserFinancials from '../models/schemas/userFinancials';
import authService from '~/services/auth.services';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  // Create a new access token
  const token = signToken(
    user._id,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as string
  );

  // Remove the password:
  user.password = '';
  user.passwordConfirm = undefined;

  // Send the JWT token as part of the response body
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, passwordConfirm, role } = req.body;

  if (!email || !password) {
    return next(new AppError(`Please provide email or password`, HTTP_STATUS.BAD_REQUEST));
  }

  try {
    const user = await User.create({
      username,
      email,
      password,
      passwordConfirm,
      role
    });

    await UserFinancials.create({ user: user._id });

    // Create a new access token
    const token = signToken(
      user._id,
      process.env.JWT_ACCESS_SECRET as string,
      process.env.JWT_ACCESS_EXPIRES_IN as string
    );

    // Remove the password:
    user.password = '';
    user.passwordConfirm = undefined;

    // Send the JWT token as part of the response body
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    return next(new AppError(`User already exists`, HTTP_STATUS.CONFLICT));
  }

  // Don't block email => don't use await
  // const url = `${req.protocol}://${req.get('host')}/api/v1/users/me`;
  // new Email(user, url).sendWelcome();
  // createSendToken(user, 201, res);
  // next(new AppError(`User already exists`, HTTP_STATUS.CONFLICT));
});

const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError(`Please provide email or password`, HTTP_STATUS.BAD_REQUEST);
  const result = await authService.logIn(email, password);

  res.status(200).json({
    status: 'success',
    token: result.token,
    data: result.data
  });
});

const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Get token and check if it exits
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError(`You're not logged in! Please log in to access this page`, 403));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: TokenPayload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as TokenPayload;
    // 2) Check if user still exists
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError(`The user belonging to this token does no longer exist.`, 401));
    }

    // 3) Check if user changed password after
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError(`User recently changed password! Please log in again.`, 401));
    }
    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(`Invalid token. Please log in again.`, 401));
  }
});

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email) {
    return next(new AppError(`Please provide email`, 400));
  }
  // 1) Get user from POSTed request email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`There is no user with email address`, 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL: string = `http://localhost:3000/reset-password?token=${resetToken}`;
    const email = new Email(user, resetURL);
    await email.sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully. Please check your gmail.'
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(`There was an error sending email. Try again later!`));
  }
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user: IUser | null = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }
  });

  if (!user) {
    return next(new AppError(MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, HTTP_STATUS.BAD_REQUEST));
  }

  // 2) If token has not expired, and there is user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  // 3) Update changedPasswordAt property for the user in the middleware of User
  await user.save({
    validateBeforeSave: false
  });
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // delete req.headers.authorization;
  res.status(200).json({
    status: 'success'
  });
});

const restrictTo = (...roles: string[]) => {
  return catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`You don't have permission to perform this action`, 403));
    }
    next();
  });
};

const updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Get User from database
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError(`This user no longer exists!!`, 404));
  }

  // 2) Check current user password with password stored in database
  if (!(await authService.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(`Your current password is wrong. Please try again`, 401));
  }

  // 3) If so, update the current password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

export default {
  signUp,
  logIn,
  logOut,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  createSendToken
};
