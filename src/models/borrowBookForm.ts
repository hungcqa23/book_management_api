import mongoose, { Schema, Document, Types, model } from 'mongoose';
import Book from './book';
import { IBorrowBookForm } from '../interfaces/IModel';

const BorrowBookFormSchema = new Schema({
  books: {
    type: [
      {
        type: Types.ObjectId,
        ref: 'Book'
      }
    ],
    required: true
  },
  borrower: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedReturnDate: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextWeek;
    }
  }
});

BorrowBookFormSchema.pre('save', async function (next) {
  try {
    const books = await Promise.all(this.books.map(bookId => Book.findById(bookId)));
    const validBooks = books.filter(book => book && book.numberOfBooks - 1 >= 0);
    if (books.length !== validBooks.length || validBooks.length == 0) {
      throw new Error('Some of the selected books are not available');
    }

    validBooks.forEach(book => {
      if (book) {
        --book.numberOfBooks;
        book.save();
      }
    });

    next();
  } catch (err: any) {
    next(err);
  }
});

const BorrowBookForm = model<IBorrowBookForm>('BorrowBookForm', BorrowBookFormSchema);

export default BorrowBookForm;
