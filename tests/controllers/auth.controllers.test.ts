import app from '../../src/app';
import request, { SuperAgentTest } from 'supertest';
import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import * as http from 'http';
import User from '../../src/models/schemas/user';
import MongoDB from '../../src/utils/mongodb';
import Email from '../../src/utils/email';

describe('/api/v1/users', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  beforeAll(async () => {
    server = app.listen(8000);
    agent = request.agent(server);
    await MongoDB.getInstance().newConnection();
    await User.create({
      username: 'testing123',
      email: 'testing123@gmail.com',
      password: '123456789',
      passwordConfirm: '123456789'
    });
  }, 15000);

  afterAll(async () => {
    server.close();
    await User.findOneAndDelete({ username: 'testing123' });
    await MongoDB.getInstance().closeConnection();
  }, 10000);

  describe('POST /api/v1/users/login', () => {
    it('should return an error if email or password is not provided', async () => {
      const response = await agent
        .post('/api/v1/users/login')
        .send({ email: 'testing123' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please provide email or password');
    }, 30000);

    it('should return an error if user is not found', async () => {
      const response = await agent
        .post('/api/v1/users/login')
        .send({ email: 'testing123', password: '123456789' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect password or email');
    });

    it('should return an error if password is incorrect', async () => {
      const response = await agent
        .post('/api/v1/users/login')
        .send({ email: 'testing123@gmail', password: '1234567' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect password or email');
    });

    it('should return a token if email and password are correct', async () => {
      const response = await agent
        .post('/api/v1/users/login')
        .send({ email: 'testing123@gmail.com', password: '123456789' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('POST /api/v1/users/signup', () => {
    it('should return an error if email or password is not provided', async () => {
      const response = await agent
        .post('/api/v1/users/signup')
        .send({ email: 'testing123' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please provide email or password');
    }, 30000);

    it('should return an error if user already exists', async () => {
      const response = await agent
        .post('/api/v1/users/signup')
        .send({
          email: 'testing123@gmail',
          username: 'testing123',
          password: '123456789',
          passwordConfirm: '123456789',
          role: 'admin'
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return a token if email and password are correct', async () => {
      try {
        const response = await agent
          .post('/api/v1/users/signup')
          .send({
            email: 'testing1234@gmail.com',
            username: 'testing1234',
            password: '123456789',
            passwordConfirm: '123456789',
            role: 'user'
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
      } catch (error) {
        console.log(error);
      } finally {
        await User.findOneAndDelete({ username: 'testing1234' });
      }
    });
  });

  describe('protect controller', () => {
    it('should return an error if user is not authenticated', async () => {
      const response = await agent
        .get('/api/v1/users/me')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(`You're not logged in! Please log in to access this page`);
    });
  });

  describe('POST /api/v1/users/forgot-password', () => {
    it('should return an error if email is not provided', async () => {
      const response = await agent
        .post('/api/v1/users/forgot-password')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please provide email');
    });

    it('should return an error if user is not found', async () => {
      const response = await agent
        .post('/api/v1/users/forgot-password')
        .send({ email: 'testing123@gmail' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('There is no user with email address');
    });

    it('should return a token if email is provided', async () => {
      try {
        const response = await agent
          .post('/api/v1/users/forgot-password')
          .send({ email: 'testing123@gmail.com' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

        jest.spyOn(Email.prototype, 'sendPasswordReset').mockImplementation(() => {
          return new Promise(resolve => resolve());
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Token sent successfully. Please check your gmail.');
      } catch (err) {
        console.log(err);
      }
    });
  });
});
