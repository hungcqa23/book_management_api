import { Schema, Document, model } from 'mongoose';

enum BookType {
  A = 'A',
  B = 'B',
  C = 'C'
}

interface IBook extends Document {
  nameBook: string;
  typeBook: BookType;
  author: string;
  publicationYear: number;
  publisher: string;
  dateOfEntry: number;
  price: number;
}

// Create Book Schema
const BookSchema = new Schema({
  nameBook: {
    type: String,
    required: true,
    unique: true
  },
  typeBook: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
    validate: {
      validator: function (value: string) {
        return ['A', 'B', 'C'].includes(value);
      },
      message: function (props: { value: string }) {
        return `${props.value} is not a valid type of book. Valid types are A, B, and C.`;
      }
    }
  },
  author: {
    type: String,
    required: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  dateOfAcquisition: {
    type: Date,
    default: Date.now(),
    required: true
  },
  price: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return /^\d+(\.\d{1,2})?$/.test(value);
      },
      message: function (props: { value: string }) {
        return `${props.value} is not a valid price. Please enter a non-negative number with up to two decimal places.`;
      }
    }
  }
});

BookSchema.pre<IBook>('save', async function (next: (err?: Error) => void) {
  try {
    // Check the number of authors
    const count = await Book.countDocuments({ author: { $exists: true } });
    if (count >= 100) {
      throw new Error(`Cannot save book. The number of authors exceeds 100`);
    }

    // Check the number of yearOfPublication
    const yearOfPublication = 2023 - this.publicationYear;
    if (yearOfPublication > 8) {
      throw new Error(`Only books published within the last 8 years are eligible`);
    }

    next();
  } catch (err) {
    next(err as Error); // Pass the error object to next
  }
});

const Book = model<IBook>('book', BookSchema);

export default Book;
