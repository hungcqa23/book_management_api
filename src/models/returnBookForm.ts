import mongoose, { Schema, Document, Types, model, CallbackError } from 'mongoose';
import BorrowBookForm from './borrowBookForm';
import Book from './book';
import {
  IBook,
  IBorrowBookForm,
  IReturnBookForm,
  IUserFinancials
} from '../interfaces/model.interfaces';
import UserFinancials from './userFinancials';
import { ppid } from 'process';

const ReturnBookFormSchema = new Schema({
  borrower: {
    type: Types.ObjectId,
    ref: 'User'
  },
  lostBooks: {
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
    ]
  },
  returnDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  borrowBookForm: {
    type: Types.ObjectId,
    ref: 'BorrowBookForm',
    unique: true
  },
  lateFee: {
    type: Number,
    default: 0
  }
});

ReturnBookFormSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'borrower',
    select: 'fullName'
  })
    .populate({
      path: 'borrowBookForm',
      select: 'borrowDate'
    })
    .populate({
      path: 'lostBooks.bookId',
      select: 'nameBook'
    });
  next();
});

ReturnBookFormSchema.pre('save', async function (next) {
  try {
    const borrowBookForm: IBorrowBookForm | null = await BorrowBookForm.findById(
      this.borrowBookForm
    );
    if (!borrowBookForm) {
      throw new Error('Related BorrowBookForm not found!');
    }

    //Calculate late fee
    const expectedDate = borrowBookForm.expectedReturnDate;
    const returnDate = this.returnDate;
    const lateFeeDays = Math.round(
      (returnDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    let lateFee = lateFeeDays > 0 ? lateFeeDays * 1 : 0;

    //Calculate lost book fee
    if (this.lostBooks && this.lostBooks.length > 0) {
      const lostBookIds = this.lostBooks.map(book => {
        if (book.bookId) return book.bookId;
      });
      const lostBooks: IBook[] = await Book.find({ _id: { $in: lostBookIds } });
      const lostBookPrices = lostBooks.map(
        (book, index) => Number(book.price) * this.lostBooks[index].quantity || 0
      );
      const lostBookFee = lostBookPrices.reduce((acc, price) => acc + price, 0);
      lateFee += lostBookFee;
    }

    // Update the book count for the lost books
    const updatePromises = borrowBookForm.books.map(async borrowedBook => {
      // Find the lost books in the borrowed books
      const lostBook = this.lostBooks.find(
        lostBook => lostBook.bookId?.toString() === borrowedBook.bookId.toString()
      );

      if (lostBook) {
        const book = await Book.findById(borrowedBook.bookId);
        if (book) {
          book.numberOfBooks += borrowedBook.quantity - lostBook.quantity;
          await book.save();
        }
      } else {
        const book = await Book.findById(borrowedBook.bookId);
        if (book) {
          book.numberOfBooks += borrowedBook.quantity;
          await book.save();
        }
      }
    });

    await Promise.all(updatePromises);

    this.lateFee = lateFee;

    // Update userFinancials
    let userFinancials: IUserFinancials | null = await UserFinancials.findOne({
      user: this.borrower
    });
    if (!userFinancials) {
      userFinancials = await UserFinancials.create({ user: this.borrower });
    }
    userFinancials.totalDebt += lateFee;
    await userFinancials.save();

    next();
  } catch (err: any) {
    next(err);
  }
});

// ReturnBookFormSchema.pre('save', async function (next) {
//   try {
//     if (this.lostBooks && this.lostBooks.length > 0) {
//       const lostBooks = await Promise.all(this.lostBooks.map(lostBook => Book.findById(lostBook)));

//       lostBooks.forEach(lostBook => {
//         if (lostBook && lostBook.price) {
//           this.lateFee += Number(lostBook.price);
//         }
//       });
//     }
//     next();
//   } catch (err: any) {
//     next(err);
//   }
// });

// ReturnBookFormSchema.pre('save', async function (next) {
//   try {
//     const borrowBookForm = await BorrowBookForm.findById(this.borrowBookForm);
//     if (!borrowBookForm) {
//       throw new Error('Related BorrowBookForm not found!');
//     }
//     const lostBookIds = this.lostBooks.map(book => book.toString());
//     const borrowedBookIds = borrowBookForm.books.map(book => book.toString());

//     const returnBooks = borrowedBookIds.filter(bookId => lostBookIds.includes(bookId));
//     const bookIdsToUpdate = returnBooks.map(book => new Types.ObjectId(book));
//     Book.updateMany(
//       {
//         _id: {
//           $in: bookIdsToUpdate
//         }
//       },
//       {
//         $inc: {
//           numberOfBooks: 1
//         }
//       }
//     );
//   } catch (err: any) {
//     next(err);
//   }
// });

const ReturnBookForm = model<IReturnBookForm>('ReturnBookForm', ReturnBookFormSchema);

export default ReturnBookForm;
