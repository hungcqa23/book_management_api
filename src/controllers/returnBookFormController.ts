import { NextFunction, Response } from 'express';
import ReturnBookForm from '../models/returnBookForm';
import handleFactory from './handleFactory';
import { AuthRequest } from '../interfaces/IModel';

const setBorrowerBookReturnFormId = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Allow nested route
  if (!req.body.borrowBookForm) req.body.borrowBookForm = req.params.borrowBookFormId;
  if (!req.body.borrower) req.body.borrower = req.user.id;
  next();
};

const getAllReturnBookForm = handleFactory.getAll(ReturnBookForm);
const getReturnBookForm = handleFactory.getOne(ReturnBookForm);
const updateReturnBookForm = handleFactory.updateOne(ReturnBookForm);
const createReturnBookForm = handleFactory.createOne(ReturnBookForm);
const deleteReturnBookForm = handleFactory.deleteOne(ReturnBookForm);

export default {
  getAllReturnBookForm,
  createReturnBookForm,
  deleteReturnBookForm,
  getReturnBookForm,
  updateReturnBookForm,
  setBorrowerBookReturnFormId
};
