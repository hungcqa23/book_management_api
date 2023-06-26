import MongoDB from '../src/utils/mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from './app';
import { setCurrentValidation } from './utils/setValidation';

// Create a new MongoDB instance
MongoDB.getInstance().newConnection();
(async () => {
  try {
    await setCurrentValidation();
    console.log('Set validation success');
  } catch (err: any) {
    console.log(err);
  }
})();

const PORT = Number(process.env.PORT as string) || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
export default server;
