import { NextFunction, Response } from 'express';
import ReturnBookForm from '../models/returnBookFormModel';
import { AuthRequest } from './authController';
import handleFactory from './handleFactory';

const setBookReturnFormId = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Allow nested route
  if (!req.body.borrowBookForm) req.body.borrowBookForm = req.params.borrowBookFormId;
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
  setBookReturnFormId
};
