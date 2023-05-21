import { Document, Schema, model, Types } from 'mongoose';
interface ILateFeeReceipt extends Document {
  user: Types.ObjectId;
  totalDebt: number;
  amountPaid: number;
}

const LateFeeReceiptSchema = new Schema(
  {
    user: {
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

const LateFeeReceiptModel = model<ILateFeeReceipt>('LateFeeReceipt', LateFeeReceiptSchema);
export default LateFeeReceiptModel;
