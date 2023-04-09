import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction, response } from 'express';
import User from '../models/userModel';
import { AuthRequest } from './authController';
import AppError from '../utils/appError';
import factory from '../controllers/handleFactory';

const getAllUsers = factory.getAll(User);
const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
});
const getUser = factory.getOne(User);

type FilterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => { [key: string]: any };
const filterObj: FilterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Create an error if user tries to POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(`This route is not for password updates. Please use /updateMyPassword`));
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const user = User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export default { getAllUsers, getUser, getMe, updateMe };
