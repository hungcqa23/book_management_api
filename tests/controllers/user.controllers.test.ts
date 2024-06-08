import app from '../../src/app';
import request, { SuperAgentTest } from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import { mockedAdmin } from '../data/mocked-data';

describe('User Controllers', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;

  beforeAll(async () => {
    server = app.listen(8000);
    agent = request.agent(server);

    // Log in the user to get the token
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send(mockedAdmin)
      .set('Content-Type', 'application/json');

    token = loginResponse.body.token;
  }, 15000);

  afterAll(async () => {
    server.close();
  }, 10000);

  describe('GET /api/v1/users/me', () => {
    it('should return an error if user is not authenticated', async () => {
      const response = await agent
        .get('/api/v1/users/me')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(`You're not logged in! Please log in to access this page`);
    }, 10000);

    it('should return the current user if user is authenticated', async () => {
      const response = await agent
        .get('/api/v1/users/me')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.doc4).toBeDefined();
    }, 10000);
  });

  describe('PATCH /api/v1/users/update-me', () => {
    it('should return an error if user update password', async () => {
      const response = await agent
        .patch('/api/v1/users/update-me')
        .send({ password: '123456789' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'This route is not for password updates. Please use /update-my-password'
      );
    });

    it('should return a new user if user update right field', async () => {
      const response = await agent
        .patch('/api/v1/users/update-me')
        .send({ username: 'testing123' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user.username).toBe('testing123');
    });
  });

  describe('PATCH /api/v1/users/update-my-password', () => {
    it('should return an error if user send wrong current password', async () => {
      const response = await agent
        .patch('/api/v1/users/update-my-password')
        .send({ passwordCurrent: '1234567', password: '123456789', newPassword: '123456789' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Your current password is wrong. Please try again');
    });

    it('should return a new user if user update right password', async () => {
      const response = await agent
        .patch('/api/v1/users/update-my-password')
        .send({ passwordCurrent: '123456789', password: '123456789', passwordConfirm: '123456789' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user.password).toBeDefined();
    });
  });
});
