import { checkAndSendNotification } from './scheduleTask';
import BorrowBookForm from '../models/schemas/borrow-book-form'; // Assuming BorrowBookForm has a mock implementation
// Assuming Reader has a mock implementation
import Email from '../../src/utils/email'; // Assuming Email has a mock implementation
import Reader from '../../src/models/schemas/reader';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
jest.mock('./scheduleTask'); // Mock the entire scheduleTask module

describe('checkAndSendNotification', () => {
  let mockBorrowBookForms: BorrowBookForm[];
  let mockReader: Reader;
  let mockEmailSend: jest.Mock;

  beforeEach(() => {
    mockBorrowBookForms = [
      { _id: '1', isReturned: false, expectedReturnDate: new Date(2024, 3, 20) }, // Overdue
      { _id: '2', isReturned: false, expectedReturnDate: new Date(2024, 4, 22) } // Not overdue
    ];
    mockReader = { email: 'reader@example.com' };
    mockEmailSend = jest.fn();
    Email.prototype.send = mockEmailSend; // Mock Email.send method

    jest.spyOn(BorrowBookForm, 'find').mockResolvedValue(mockBorrowBookForms); // Mock BorrowBookForm.find
    jest.spyOn(Reader, 'findById').mockResolvedValue(mockReader); // Mock Reader.findById
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send notifications for overdue borrow forms', async () => {
    await checkAndSendNotification();

    expect(BorrowBookForm.find).toHaveBeenCalled();
    expect(Reader.findById).toHaveBeenCalledWith(mockBorrowBookForms[0].borrower); // Only for overdue form
    expect(mockEmailSend).toHaveBeenCalledWith('Over due', 'Your book is overdue!');
  });

  it('should not send notifications for non-overdue borrow forms', async () => {
    await checkAndSendNotification();

    expect(Reader.findById).toHaveBeenCalledTimes(1); // Only called once for overdue form
    expect(mockEmailSend).toHaveBeenCalledTimes(1); // Only sent for overdue form
  });

  it('should log an error if reader is not found', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(() => {}); // Mock console.log

    Reader.findById.mockResolvedValue(null); // Simulate reader not found

    await checkAndSendNotification();

    expect(console.log).toHaveBeenCalledWith(
      `Reader not found for BorrowBookForm: ${mockBorrowBookForms[0]._id}`
    );
  });
});
