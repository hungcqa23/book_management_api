import { Schema, Document, model } from 'mongoose';
import Review from './review';
import slugify from 'slugify';
import { IBook } from '../interfaces/model.interfaces';

// Create Book Schema
const BookSchema = new Schema(
  {
    nameBook: {
      type: String,
      required: true,
      unique: true
    },
    author: {
      type: String,
      required: true
    },
    photos: {
      type: [
        {
          type: Buffer
        }
      ],
      validate: {
        validator: function (photos: Buffer[]) {
          return photos.length <= 3;
        },
        message: 'Photo array must contain at most 3 images'
      },
      select: false
    },
    photoUrls: {
      type: [
        {
          type: String
        }
      ]
    },
    publicationYear: {
      type: Number,
      required: true,
      validate: {
        validator: function (publicationYear: number) {
          return (
            new Date().getFullYear() - publicationYear <= 8 &&
            publicationYear <= new Date().getFullYear()
          );
        },
        message: 'Only accept books published within the last 8 years.'
      }
    },
    publisher: {
      type: String,
      required: true
    },
    dateOfAcquisition: {
      type: Date,
      default: Date.now,
      required: true
    },
    pages: {
      type: Number,
      required: true,
      validate: {
        validator: function (pages: number) {
          return pages > 0;
        },
        message: 'Number of pages must be greater than 0'
      }
    },
    language: {
      type: String,
      required: true
    },
    genres: {
      type: [
        {
          type: String
        }
      ],
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
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be greater than or equal 0'],
      max: [5, 'Rating must be less than or equal 5.0'],
      set: (val: number) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    },
    numberOfBooks: {
      type: Number,
      required: true,
      default: 5,
      validate: {
        validator: function (numOfBooks: number) {
          return numOfBooks <= 100 && numOfBooks >= 0;
        },
        message: `Number of books must be less than or equal 100`
      }
    },
    numberOfPages: {
      type: Number,
      validate: {
        validator: function (numOfPages: number) {
          return numOfPages >= 0;
        },
        message: 'Number of pages must be greater than 0'
      }
    },
    slug: {
      type: String,
      unique: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

BookSchema.pre<IBook>('save', function (next) {
  this.slug = slugify(this.nameBook, { lower: true });
  next();
});

BookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book'
});

BookSchema.methods.generatePhotosUrl = function (photos: Buffer[]) {
  const photoUrls: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    photoUrls.push(`${process.env.APP_URL}/api/v1/books/${this._id}/images/${i}`);
  }
  return photoUrls;
};

BookSchema.pre('save', function (next): void {
  if (this.photos) {
    console.log('HAS PHOTOS');
    console.log(this.photos);
    const photoUrls: string[] = [];
    for (let i = 0; i <= this.photos.length; i++)
      photoUrls.push(`${process.env.APP_URL}/api/v1/books/${this._id}/images/${i}`);

    this.photoUrls = photoUrls;
  }
  next();
});

BookSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { photos: Buffer[]; title?: string };
  if (update && update.photos) {
    const book: IBook | null = await Book.findOne(this.getQuery()).select('+photos');
    if (book) {
      book.photoUrls = book.generatePhotosUrl(update.photos);
      // const newBook = await book.save();
    }
  }

  if (update && update.title) {
    const book = await this.model.findOne(this.getQuery());
    book.slug = slugify(book.title, { lower: true });
    await book?.save();
  }
  next();
});

BookSchema.pre('findOneAndDelete', async function (next) {
  const bookId = this.getFilter()._id;
  Review.deleteMany({ book: bookId });
  next();
});

const Book = model<IBook>('Book', BookSchema);
// const createBookId = async () => {
//   try {
//     await Book.collection.createIndex(
//       { nameBook: 'text' },
//       {
//         default_language: 'none',
//         language_override: 'none'
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
// createBookId();

export default Book;
