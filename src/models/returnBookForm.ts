import mongoose, { Schema, Document, Types, model, CallbackError } from 'mongoose';
import BorrowBookForm from './borrowBookForm';
import Book from './book';
import { IReturnBookForm, IUserFinancials } from '../interfaces/IModel';
import UserFinancials from './userFinancials';

const ReturnBookFormSchema = new Schema({
  borrower: {
    type: Types.ObjectId,
    ref: 'User'
  },
  lostBooks: {
    type: [
      {
        type: Types.ObjectId,
        ref: 'Book'
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

ReturnBookFormSchema.pre('save', async function (next) {
  try {
    const borrowBookForm = await BorrowBookForm.findById(this.borrowBookForm);
    if (!borrowBookForm) {
      throw new Error('Related BorrowBookForm not found!');
    }

    //Calculate late fee
    const expectedDate = borrowBookForm.expectedReturnDate;
    const returnDate = this.returnDate;
    const lateFeeDays = Math.floor(
      (returnDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    let lateFee = lateFeeDays > 0 ? lateFeeDays * 1 : 0;

    const lostBookIds = this.lostBooks.map(book => new Types.ObjectId(book.toString()));

    //Calculate lost book fee
    if (this.lostBooks && this.lostBooks.length > 0) {
      const lostBooks = await Book.find({ _id: { $in: lostBookIds } });
      const lostBookPrices = lostBooks.map(book => Number(book.price) || 0);
      const lostBookFee = lostBookPrices.reduce((acc, price) => acc + price, 0);
      lateFee += lostBookFee;
    }

    let returnBooks = [...borrowBookForm.books];
    //Update book count
    if (this.lostBooks && this.lostBooks.length > 0) {
      const lostBookIds = this.lostBooks.map(book => book.toString());
      const borrowedBookIds = borrowBookForm.books.map(book => book.toString());

      returnBooks = borrowedBookIds
        .filter(bookId => {
          const idString = bookId.toString();
          if (!lostBookIds.includes(idString)) return true;
          else return false;
        })
        .map(bookId => new Types.ObjectId(bookId.toString()));
    }

    await Book.updateMany(
      {
        _id: {
          $in: returnBooks
        }
      },
      {
        $inc: { numberOfBooks: 1 }
      }
    );
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
