import Book from '../models/bookModel';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const getAllBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const books = await Book.find();

  res.status(200).json({
    status: 'success',
    data: {
      books
    }
  });
});

const getBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new AppError(`No book found with that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

const createBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.create(req.body);

  if (!book) {
    return next(new AppError(`No book found with that ID`, 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      book
    }
  });
});

const updateBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!book) {
    return next(new AppError(`No book found with that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError(`No book found with that ID`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export default { getAllBook, getBook, createBook, updateBook, deleteBook };
