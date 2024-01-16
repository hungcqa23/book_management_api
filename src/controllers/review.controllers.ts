import { Response, NextFunction } from 'express';
import Review from '../models/schemas/review';
import factory from './factory.controllers';
import { AuthRequest } from '../models/interfaces/model.interfaces';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

const setBookUserIds = (req: AuthRequest, res: Response, next: NextFunction) => {
  //Allow nested route
  if (!req.body.book) req.body.book = req.params.bookId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getReviewsByBookId = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.params.bookId) {
      next(new AppError('Please provide book id', 400));
    }
    const { bookId } = req.params;
    const reviews = await Review.find({ book: bookId });

    res.status(200).json({
      status: 'success',
      data: {
        reviews
      }
    });
  }
);
const getAllReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const reviews = await Review.find(req.params.bookId ? { book: req.params.bookId } : {});
  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
});
const createReview = factory.createOne(Review);
const getReview = factory.getOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

export default {
  getAllReview,
  createReview,
  deleteReview,
  getReview,
  updateReview,
  setBookUserIds,
  getReviewsByBookId
};
