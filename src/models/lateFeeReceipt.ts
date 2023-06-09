import { Document, Schema, model, Types } from 'mongoose';
import UserFinancials from './userFinancials';
import AppError from '../utils/appError';
import { ILateFeeReceipt, IUserFinancials } from '../interfaces/IModel';

const LateFeeReceiptSchema = new Schema(
  {
    userFinancials: {
      type: Types.ObjectId,
      required: true
    },
    totalDebt: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      required: true
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

LateFeeReceiptSchema.virtual('remainingBalance').get(function (this: ILateFeeReceipt) {
  return this.totalDebt - this.amountPaid;
});

LateFeeReceiptSchema.pre<ILateFeeReceipt>('save', async function (next) {
  if (this.amountPaid > this.totalDebt) {
    const error = new AppError('Amount paid cannot be greater than total debt', 400);
    return next(error);
  }

  const userFinancials: IUserFinancials | null = await UserFinancials.findById(this.userFinancials);
  if (!userFinancials) {
    return next(new AppError(`Can't find the userFinancial`, 404));
  }

  userFinancials.money -= this.amountPaid;
  userFinancials.totalDebt -= this.amountPaid;
  userFinancials.save();
  return next();
});

const LateFeeReceiptModel = model<ILateFeeReceipt>('LateFeeReceipt', LateFeeReceiptSchema);
export default LateFeeReceiptModel;
