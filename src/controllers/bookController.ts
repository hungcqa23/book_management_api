import Book from '../models/bookModel';
import { Request, Response } from 'express';

const getAllBook = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: 'success',
      data: {
        books
      }
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
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
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      error: err.message
    });
  }
};

export default { getAllBook, getBook, createBook, updateBook, deleteBook };
