import { NextFunction, Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import {
  GetAllFn,
  CreateOneFn,
  UpdateOneFn,
  DeleteOneFn,
  PopOptions
} from '../interfaces/IFactory';

const getAll = (Model: Model<any>): GetAllFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { book: req.params.bookId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

const updateOne = (Model: Model<any>): UpdateOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: Document | null = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

const createOne = (Model: Model<any>): CreateOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

const deleteOne = (Model: Model<any>): DeleteOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`No doc found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};

const getOne = (Model: Model<any>, popOptions?: PopOptions) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    if (popOptions) doc = await doc.populate(popOptions);

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

export default {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne
};
