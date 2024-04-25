import mongoose from 'mongoose';
import MongoDB from '../../src/utils/mongodb';
import { describe, it, jest, afterEach, beforeAll, expect } from '@jest/globals';
import { config } from 'dotenv';
config();

describe('MongoDB', () => {
  let mongodb: MongoDB;

  beforeAll(() => {
    mongodb = MongoDB.getInstance();
  });

  afterEach(async () => {
    // Clean up after each test
    await mongoose.connection.close();
  });

  it('should create a new instance', () => {
    expect(mongodb).toBeInstanceOf(MongoDB);
  });

  it('should establish a database connection', async () => {
    await mongodb.newConnection();
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('should throw an error if connection fails', async () => {
    // Mocking environment variables to force connection failure

    await expect(mongodb.newConnection('mockConnectionString')).rejects.toThrow();
  });
});
