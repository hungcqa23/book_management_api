import mongoose, { Schema, model, Model, CallbackError, Types, Document } from 'mongoose';
import Book from './book';
import { IReview, IReviewModel } from '../interfaces/IModel';

const ReviewSchema = new Schema({
  review: {
    type: String,
    required: [true, `Review can't be empty`]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
});

ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName avatar_url'
  });
  next();
});

ReviewSchema.statics.calcAverageRatings = async function (bookId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

ReviewSchema.post<IReview>('save', function () {
  const Model = this.constructor as IReviewModel;
  Model.calcAverageRatings(this.book);
});

ReviewSchema.post<IReview>(/^findOneAnd/, async function (doc: IReview, next) {
  try {
    this.r = { book: doc.book };
    next();
  } catch (err: any) {
    next(err);
  }
});

ReviewSchema.post<IReview>(/^findOneAnd/, async function (doc: any) {
  if (doc && this.r) {
    await doc.constructor.calcAverageRatings(this.r.book);
  }
});

const Review: Model<IReview> = model<IReview>('Review', ReviewSchema);
export default Review;
