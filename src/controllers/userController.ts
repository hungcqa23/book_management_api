import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import { AuthRequest } from './authController';
import AppError from '../utils/appError';
import factory from '../controllers/handleFactory';
import multer, { Multer } from 'multer';
import sharp from 'sharp';

const upload: Multer = multer({
  storage: multer.memoryStorage()
});
const uploadAvatar = upload.single('avatar');

const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
});

const getAllUsers = factory.getAll(User);
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
  const filteredBody = filterObj(req.body, 'firstName', 'lastName');
  if (req.file) {
    filteredBody.avatar = req.file.buffer;
  }

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
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

const getAvatar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user: IUser | null = await User.findById(req.params.id).select('+avatar');
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }

  const avatar: Buffer | undefined = user.avatar;

  const sharpImage = await sharp(avatar).resize(64).sharpen().toBuffer();
  // Set content-type header to image/jpeg
  res.setHeader('Content-Type', 'image/jpeg');
  // Send sharpened image to client
  return res.send(sharpImage);
});

export default { getAllUsers, getUser, getMe, updateMe, uploadAvatar, getAvatar };
