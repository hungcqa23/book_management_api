import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import uuid from 'uuid';
import crypto from 'crypto';

enum RoleType {
  user = 'user',
  admin = 'admin'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  avatar: Buffer | undefined;
  role: RoleType;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
}

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Tell me about your first name']
  },
  lastName: {
    type: String,
    required: [true, 'Tell me about your last name']
  },
  email: {
    type: String,
    required: [true, 'This is required field!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'You must provide a valid email!!']
  },
  avatar: {
    type: Buffer,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 9,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: IUser, value: string) {
        return value === this.password;
      },
      message: 'Passwords are not the same! Please try again'
    },
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password with generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Clean the confirmed password field
  this.passwordConfirm = '';

  next();
});

UserSchema.pre('save', function (next): void {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  // -1s because this token may issued before password changed at

  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp: number = this.passwordChangedAt.getTime() / 1000;
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function (): string {
  // 1) Generate a random token using uuid
  const resetToken = uuid.v4();

  // 2) Hash the token and store it in the user document
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // 3) Set an expiration time for the token (10 mins)
  this.passwordResetExpires = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

const User = model<IUser>('User', UserSchema);

export default User;
