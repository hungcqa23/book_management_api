import mongoose, { Document, Types, model, Schema } from 'mongoose';
import { IUserFinancials } from '../interfaces/model.interfaces';

const UserFinancialsSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
    validate: {
      validator: function (money: number) {
        return money >= 0;
      },
      message: `Money must be greater or equal 0$`
    }
  },
  totalDebt: {
    type: Number,
    default: 0,
    required: true
  }
});

const UserFinancials = model<IUserFinancials>('UserFinancials', UserFinancialsSchema);

export default UserFinancials;
