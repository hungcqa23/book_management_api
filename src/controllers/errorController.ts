import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export default (err: AppError, req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
