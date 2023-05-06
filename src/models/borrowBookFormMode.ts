import mongoose, { Schema, Document, Types, model } from 'mongoose';

export interface IBorrowBookForm extends Document {
  books: Types.ObjectId;
  borrowDate: Date;
  expectedReturnDate: Date;
  borrower: Types.ObjectId;
}

const BorrowBookFormSchema = new Schema({
  books: {
    type: [
      {
        type: Types.ObjectId
      }
    ],
    required: true
  },
  borrower: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
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

const BorrowBookForm = model<IBorrowBookForm>('BorrowBookForm');

export default BorrowBookForm;
