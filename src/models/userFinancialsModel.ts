import mongoose, { Document, Types, model, Schema } from 'mongoose';

interface IUserFinancials extends Document {
  user: Types.ObjectId;
  money: number;
  totalDebt: number;
}

const UserFinancialsSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true
  },
  money: {
    type: Number,
    default: 0,
    required: true
  },
  totalDebt: {
    type: Number,
    default: 0,
    required: true
  }
});

const UserFinancials = model<IUserFinancials>('UserMoney', UserFinancialsSchema);

export default UserFinancials;
