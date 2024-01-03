// scheduleTask.ts

import { IBorrowBookForm } from '../models/interfaces/model.interfaces';
import BorrowBookForm from '../models/schemas/borrow-book-form';
import Reader from '../models/schemas/reader';
import Email from './email';

export const checkAndSendNotification = async () => {
  const now = new Date();
  const borrowForms = await BorrowBookForm.find({
    isReturned: false,
    expectedReturnDate: { $lte: now }
  });

  for (const borrowForm of borrowForms) {
    await sendNotification(borrowForm);
  }
};

export const sendNotification = async (borrowForm: IBorrowBookForm) => {
  const reader = await Reader.findById(borrowForm.borrower);
  if (!reader) {
    console.log(`Reader not found for BorrowBookForm: ${borrowForm._id}`);
    return;
  }

  const { email } = reader;
  new Email(undefined, undefined, email).send('Over due', 'Your book is overdue!');
};
