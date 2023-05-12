import { Response, Request, NextFunction } from 'express';
import Book from '../models/bookModel';
import catchAsync from '../utils/catchAsync';
import Stripe from 'stripe';
import AppError from '../utils/appError';
import { AuthRequest } from './authController';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});
const getCheckOutSession = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1) Get the currently booked tour
    const bookIds = req.body.bookIds as string[]; //array of book IDs to be purchased
    const books = await Book.find({ _id: { $in: bookIds } });

    if (books.length === 0) {
      return next(new AppError(`Couldn't find any books to purchase!`));
    }

    const lineItems = books.map(book => {
      return {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${book.nameBook} Book`,
            description: book.description,
            images: ['https://i.pinimg.com/564x/13/c5/dc/13c5dcaa8d8944daadf9d78d949fa7e3.jpg']
          },
          unit_amount: Number(book.price) * 100
        }
      };
    });

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout`,
      customer_email: req.user.email,
      client_reference_id: req.user.id,
      line_items: lineItems,
      mode: 'payment'
    });

    //3) Create session as response
    res.status(200).json({
      status: 'success',
      session
    });
  }
);

export default { getCheckOutSession };
