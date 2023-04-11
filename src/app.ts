import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParse from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import globalErrorHandler from './controllers/errorController';

import booksRouter from './routes/bookRoutes';
import usersRoute from './routes/userRoutes';
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
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users', usersRoute);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
