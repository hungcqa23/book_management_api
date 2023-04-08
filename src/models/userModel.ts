import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

enum RoleType {
  user = 'user',
  admin = 'admin'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  avatar: Buffer;
  role: RoleType;
  email: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
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
    type: Buffer
  },
  role: {
    type: String,
    enum: ['user, admin']
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
    }
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

const User = model<IUser>('User', UserSchema);

export default User;
