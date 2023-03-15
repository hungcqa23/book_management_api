import { Schema, model, Document } from 'mongoose';

enum ReaderType {
  X = 'X',
  Y = 'Y'
}

interface IReader extends Document {
  fullName: string;
  readerType: ReaderType;
  address: string;
  dateOfBirth: Date;
  email: string;
  cardCreatedAt: Date;
}

// Create Reader Schema
const ReaderSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  readerType: {
    type: String,
    enum: ['X', 'Y'],
    required: true,
    validate: {
      validator: function (value: string) {
        return ['X', 'Y'].includes(value);
      },
      message: function (props: { value: string }) {
        return `${props.value} is not a valid type of reader. Valid types are X and Y.`;
      }
    }
  },
  address: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cardCreatedAt: {
    type: Date,
    required: true
  }
});

ReaderSchema.pre<IReader>('save', function (next): void {
  const age = calculateAge(this.dateOfBirth);

  if (age < 18 || age > 55) {
    const error = new Error('Reader age must be between 18 and 55');
    next(error);
  }

  next();
});

const ReaderModel = model<IReader>('Reader', ReaderSchema);

const calculateAge = (dateOfBirth: Date): number => {
  const ageInMilliseconds = Date.now() - dateOfBirth.getTime();
  const ageInYear = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(ageInYear);
};

export default ReaderModel;
