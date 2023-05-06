import mongoose, { Schema, Document, Types, model, CallbackError } from 'mongoose';
import BorrowBookForm, { IBorrowBookForm } from './borrowBookFormMode';

export interface IReturnBookForm extends Document {
  books: Types.ObjectId[];
  borrower: Types.ObjectId;
  returnDate: Date;
  isReturned: boolean;
  borrowBookForm: Types.ObjectId;
  lateFee: Number;
}

const ReturnBookFormSchema = new Schema({
  books: [
    {
      type: Types.ObjectId,
      ref: 'Book',
      required: true
    }
  ],
  borrower: {
    type: Types.ObjectId,
    ref: 'Reader'
  },
  returnDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  borrowBookForm: {
    type: Types.ObjectId,
    ref: 'BorrowBookForm'
  },
  lateFee: {
    type: Number,
    default: 0
  }
});

ReturnBookFormSchema.pre('save', async function (next) {
  try {
    const borrowBookForm = await BorrowBookForm.findById(this.borrowBookForm);
    if (!borrowBookForm) {
      throw new Error('Related BorrowBookForm not found!');
    }
    const expectedDate = borrowBookForm.expectedReturnDate;
    const returnDate = this.returnDate;
    const lateFeeDays = Math.floor(
      (returnDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (lateFeeDays > 0) {
      this.lateFee = lateFeeDays * 1000;
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

ReturnBookFormSchema.pre('save', async function (next) {
  try {
  } catch (err: any) {
    next(err);
  }
});

const ReturnBookForm = model<IReturnBookForm>('ReturnBookForm', ReturnBookFormSchema);

export default ReturnBookForm;
