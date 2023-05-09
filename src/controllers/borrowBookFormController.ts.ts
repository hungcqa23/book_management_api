import ReturnBookForm from '../models/returnBookFormModel';
import handleFactory from './handleFactory';
import BorrowBookForm from '../models/borrowBookFormMode';
import { AuthRequest } from './authController';
import { NextFunction, Response } from 'express';

const setBorrowerId = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.body.borrower) req.body.borrower = req.user.id;
  next();
};
const getAllBorrowBookForm = handleFactory.getAll(BorrowBookForm);
const getBorrowBookForm = handleFactory.getOne(BorrowBookForm);
const updateBorrowBookForm = handleFactory.updateOne(BorrowBookForm);
const createBorrowBookForm = handleFactory.createOne(BorrowBookForm);
const deleteBorrowBookForm = handleFactory.deleteOne(BorrowBookForm);

export default {
  getAllBorrowBookForm,
  getBorrowBookForm,
  createBorrowBookForm,
  deleteBorrowBookForm,
  updateBorrowBookForm,
  setBorrowerId
};
