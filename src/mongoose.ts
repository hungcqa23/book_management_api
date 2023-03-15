import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

const url: string = 'mongodb+srv://anbeel191:59u6Xidr6igXfEzV@cluster0.6rwjsnj.mongodb.net/test';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();
