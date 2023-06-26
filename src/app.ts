import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParse from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';

import bookRouter from './routes/book.routes';
import userRouter from './routes/user.routes';
import reviewRouter from './routes/review.routes';
import orderRouter from './routes/order.routes';
import borrowBookFormRouter from './routes/borrowBookForm.routes';
import userTransactionRouter from './routes/userTransaction.routes';
import readerRouter from './routes/reader.routes';
import returnBookFormRouter from './routes/returnBookForm.routes';
import feeReceiptRouter from './routes/feeReceipt.routes';
import userFinancialsRouter from './routes/userFinancials.routes';
import validationRouter from './routes/validation.routes';

const app: Express = express();
app.set('view engine', 'pug');

app.use(cookieParse());

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(morgan('dev'));
app.use(express.json());

// ROUTES
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orderings', orderRouter);
app.use('/api/v1/borrow-book-forms', borrowBookFormRouter);
app.use('/api/v1/return-book-forms', returnBookFormRouter);
app.use('/api/v1/user-transactions', userTransactionRouter);
app.use('/api/v1/fee-receipts', feeReceiptRouter);
app.use('/api/v1/user-financials', userFinancialsRouter);
app.use('/api/v1/readers', readerRouter);
app.use('/api/v1/validation', validationRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
