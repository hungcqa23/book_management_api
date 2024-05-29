import mongoose from 'mongoose';

export default class MongoDB {
  private static instance: MongoDB;
  private constructor() {}

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async newConnection(connectionStr?: string): Promise<void> {
    const connectionString =
      connectionStr ||
      (process.env.DATABASE ?? '').replace('<password>', process.env.DATABASE_PASSWORD ?? '');
    try {
      await mongoose.connect(connectionString);
      console.log('Successful database connection!');
    } catch (err) {
      console.error('Database connection error:', err);
      throw err;
    }
  }

  public async closeConnection(): Promise<void> {
    await mongoose.connection.close();
  }
}
