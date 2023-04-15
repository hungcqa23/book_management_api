import mongoose, { Schema, model } from 'mongoose';

interface IReview extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

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

const Review = model<IReview>('Review', ReviewSchema);
export default Review;
