import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './app';

const connectionString = (process.env.DATABASE ?? '').replace('<PASSWORD>', process.env.DATABASE_PASSWORD ?? '');

mongoose.connect(connectionString).then(() => {
  console.log('Successful connection!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
