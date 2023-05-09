import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParse from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import globalErrorHandler from './controllers/errorController';

import bookRouter from './routes/bookRoutes';
import userRouter from './routes/userRoutes';
import reviewRouter from './routes/reviewRoutes';
import borrowBookFormRouter from './routes/borrowBookFormRoutes';
import AppError from './utils/appError';

const app: Express = express();
app.set('view engine', 'pug');

app.use(cookieParse());
// Set security HTTP headers
app.use(helmet());
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());

// ROUTES
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/borrowBookForms', borrowBookFormRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
