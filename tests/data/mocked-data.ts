export const mockedAdmin = { email: 'testingadmin@gmail.com', password: '123456789' };
export const mockedBook = {
  _id: '649103b96b87475f3b0633cc',
  nameBook: 'The Catcher in the Rye 6',
  typeBook: 'A',
  author: 'J.D. Salinger',
  publicationYear: 2023,
  publisher: 'Little, Brown and Company',
  price: '10.99',
  description:
    'The Catcher in the Rye is a novel by J.D. Salinger, first published in 1951. It is known for its distinctive narrative voice and controversial themes, and is widely regarded as a classic of 20th-century American literature.',
  language: 'English',
  pages: 200
};

export const mockedReader = {
  _id: '66598633f9f138b9bed4dce3',
  fullName: 'John Doe',
  readerType: 'Romance',
  address: '123 Main St',
  dateOfBirth: '1980-01-01',
  user: '665a8138eebc6f5fc9baa001'
};

export const mockedBorrowCard = {
  _id: '6659d5960f246d60310a0bd3',
  borrower: '665a8138eebc6f5fc9baa001',
  books: [
    {
      bookId: '649103b96b87475f3b0633ae',
      quantity: 1
    }
  ]
};

export const mockedReturnCard = {
  _id: '6659c5e1f9f138b9bed4ddb7',
  lostBooks: [
    {
      bookId: '649103b96b87475f3b0633ae',
      quantity: 1
    }
  ]
};
