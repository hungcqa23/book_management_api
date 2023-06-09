import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { validate } from 'uuid';
import validator from 'validator';
import { calculateAge } from '../utils/dateUtils';

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
  user: Types.ObjectId;
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
    required: true,
    validate: {
      validator: function (value: Date) {
        const age = calculateAge(value);
        return age >= 18 && age <= 55;
      },
      message: 'Reader age must be between 18 and 55'
    }
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
    type: Types.ObjectId,
    ref: 'User'
  }
});

const Reader = model<IReader>('Reader', ReaderSchema);

export default Reader;
