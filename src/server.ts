import MongoDB from '../src/utils/mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from './app';

// Create a new MongoDB instance
MongoDB.getInstance().newConnection();

const PORT = Number(process.env.PORT as string) || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
export default server;
