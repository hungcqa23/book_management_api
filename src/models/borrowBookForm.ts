import mongoose, { Schema, Document, Types, model } from 'mongoose';
import Book from './book';
import { IBorrowBookForm } from '../interfaces/model.interfaces';

const BorrowBookFormSchema = new Schema({
  books: {
    type: [
      {
        bookId: {
          type: Types.ObjectId,
          ref: 'Book'
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    required: true
  },
  borrower: {
    type: Types.ObjectId,
    required: true,
    ref: 'Reader'
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedReturnDate: {
    type: Date,
    required: true,
    default: function () {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextWeek;
    }
  },
  isReturned: {
    type: Boolean,
    default: false,
    required: true
  }
});

BorrowBookFormSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'borrower',
    select: 'fullName'
  });

  this.find({ isReturned: { $ne: true } });
  next();
});

BorrowBookFormSchema.pre('findOne', function (next) {
  this.populate({
    path: 'books.bookId',
    select: 'nameBook'
  });
  next();
});

BorrowBookFormSchema.pre('save', async function (next) {
  try {
    const bookPromises = this.books.map(book => Book.findById(book.bookId));
    const books = await Promise.all(bookPromises);
    const validBooks = books.filter(
      (book, index) => book && book.numberOfBooks >= this.books[index].quantity
    );
    if (books.length !== validBooks.length || validBooks.length === 0) {
      throw new Error('Some of the selected books are not available');
    }

    validBooks.forEach((book, index) => {
      if (book) {
        book.numberOfBooks -= this.books[index].quantity;
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
