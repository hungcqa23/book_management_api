import Book from '../models/bookModel';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const books = await Book.find();
  res.status(200).json({
    status: 'success',
    data: {
      books
    }
  });
});

const getBook = catchAsync(async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

const createBook = catchAsync(async (req: Request, res: Response) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book
    }
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  await Book.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export default { getAllBook, getBook, createBook, updateBook, deleteBook };
