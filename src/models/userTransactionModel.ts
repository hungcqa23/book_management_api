import { Document, Schema, model, Types } from 'mongoose';

interface IUserTransaction extends Document {
  user: Types.ObjectId;
  money: number;
  createdAt: Date;
  status: string;
}

const UserTransactionSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true
  },
  money: {
    type: Number,
    default: 0,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    default: 'unpaid',
    required: true
  }
});

const UserTransaction = model<IUserTransaction>('UserMoney', UserTransactionSchema);

export default UserTransaction;
