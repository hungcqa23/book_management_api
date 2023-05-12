import mongoose, { Document, Schema, Types } from 'mongoose';

interface IOrder extends Document {
  book: Types.ObjectId;
  user: Types.ObjectId;
  price: number;
  createdAt: Date;
  paid: boolean;
}

const orderingSchema = new Schema({
  book: {
    type: Types.ObjectId,
    ref: 'Book',
    required: [true, 'Ordering must belong to a book!']
  }
});
