import Book from '../models/bookModel';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import factory from '../controllers/handleFactory';

const getAllBook = factory.getAll(Book);
const getBook = factory.getOne(Book);
const createBook = factory.createOne(Book);
const deleteBook = factory.deleteOne(Book);
const updateBook = factory.updateOne(Book);

export default { getAllBook, getBook, createBook, updateBook, deleteBook };
