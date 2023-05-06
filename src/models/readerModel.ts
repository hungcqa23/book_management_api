import mongoose, { Schema, model, Document, Mongoose, mongo } from 'mongoose';
import validator from 'validator';
import User from './userModel';
enum ReaderType {
  Member = 'member',
  Manager = 'manager'
}

interface IReader extends Document {
  fullName: string;
  readerType: ReaderType;
  address: string;
  dateOfBirth: Date;
  email: string;
  cardCreatedAt: Date;
  user: mongoose.Schema.Types.ObjectId;
}

// Create Reader Schema
const ReaderSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  readerType: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
    validate: {
      validator: function (value: string) {
        return ['user', 'admin'].includes(value);
      },
      message: function (props: { value: string }) {
        return `${props.value} is not a valid type of reader. Valid types are user and admin.`;
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
  cardCreatedAt: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

const calculateAge = (dateOfBirth: Date): number => {
  const ageInMilliseconds = Date.now() - dateOfBirth.getTime();
  const ageInYear = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(ageInYear);
};

const ReaderModel = model<IReader>('Reader', ReaderSchema);

export default ReaderModel;
