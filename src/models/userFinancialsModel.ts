import mongoose, { Document, Types, model, Schema } from 'mongoose';

export interface IUserFinancials extends Document {
  user: Types.ObjectId;
  money: number;
  totalDebt: number;
}

const UserFinancialsSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    unique: true
  },
  money: {
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

const UserFinancials = model<IUserFinancials>('UserMoney', UserFinancialsSchema);

export default UserFinancials;
