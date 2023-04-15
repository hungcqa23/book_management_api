import { Response, NextFunction } from 'express';
import Review from '../models/reviewModel';
import factory from './handleFactory';
import { AuthRequest } from './authController';

const setTourUserIds = (req: AuthRequest, res: Response, next: NextFunction) => {
  //Allow nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReview = factory.getAll(Review);
const createReview = factory.createOne(Review);
const getReview = factory.getOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

export default {
  getAllReview,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourUserIds
};
