import MongoDB from './utils/mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './app';

// Create a new MongoDB instance
MongoDB.getInstance().newConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
