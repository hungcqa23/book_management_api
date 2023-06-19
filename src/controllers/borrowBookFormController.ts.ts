import ReturnBookForm from '../models/returnBookForm';
import handleFactory from './handleFactory';
import BorrowBookForm from '../models/borrowBookForm';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../interfaces/model.interfaces';

const setBorrowerId = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.body.borrower) {
    req.body.borrower = req.user.id;
  }

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
