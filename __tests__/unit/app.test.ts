import request from 'supertest';
import MongoDB from '../../src/utils/mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// Create a new MongoDB instance
MongoDB.getInstance().newConnection();
import app from '../../src/app';
import User from '../../src/models/userModel';

describe('Signup route', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await User.create({
      firstName: 'Dept',
      lastName: 'John',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });
    console.log('Completed SetUp');
  }, 10000);

  it('should return 201 if user is signed up successfully', async () => {
    const res = await request(app).post('/api/v1/users/signUp').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'anbeel191@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
  });

  it('should return 201 if user is logged in successfully', async () => {
    const res = await request(app).post('/api/v1/users/logIn').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(200);
  });

  // it('should return 400 if user is logged in unsuccessfully', async () => {
  //   const res = await request(app).post('/api/v1/users/logIn').send({
  //     password: 'password123'
  //   });
  //   expect(res.status).toBe(400);
  // }, 10000);
});
