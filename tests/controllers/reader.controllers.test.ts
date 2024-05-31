import request, { SuperAgentTest } from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../../src/app';
import http from 'http';
import { mockedReader } from '../data/mocked-data';

describe('Reader Controllers', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;

  beforeAll(async () => {
    server = app.listen(8000);
    agent = request.agent(server);

    // Log in the user to get the token
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send({ email: 'testingadmin@gmail.com.vn', password: '123456789' })
      .set('Content-Type', 'application/json');

    token = loginResponse.body.token;
  }, 15000);

  afterAll(async () => {
    server.close();
  }, 10000);

  describe('DELETE /api/v1/readers/:id', () => {
    it('should return an error if user is not authenticated', async () => {
      const response = await agent
        .delete(`/api/v1/readers/${mockedReader._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(`You're not logged in! Please log in to access this page`);
    });

    it('should delete a reader', async () => {
      const response = await agent
        .delete(`/api/v1/readers/${mockedReader._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/v1/readers', () => {
    it('should return an error if user is not authenticated', async () => {
      const response = await agent
        .post('/api/v1/readers')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(`You're not logged in! Please log in to access this page`);
    });

    it('should create a new reader', async () => {
      const response = await agent
        .post('/api/v1/readers')
        .send(mockedReader)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.data.reader).toBeDefined();
    });

    it('should return an error if reader already exists', async () => {
      const response = await agent
        .post('/api/v1/readers')
        .send(mockedReader)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/readers', () => {
    it('should return an error if user is not authenticated', async () => {
      const response = await agent
        .get('/api/v1/readers')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(`You're not logged in! Please log in to access this page`);
    });

    it('should return a list of readers', async () => {
      const response = await agent
        .get('/api/v1/readers')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.doc.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/readers/:id', () => {
    it('should return an error if reader id is not wrong format id', async () => {
      const response = await agent
        .get('/api/v1/readers/1')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
    });

    it('should return an error if reader id is not found', async () => {
      const response = await agent
        .get('/api/v1/readers/649103b96b87475f3b0633af')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No document was found with that ID.');
    });

    it('should return a reader', async () => {
      const response = await agent
        .get(`/api/v1/readers/${mockedReader._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.doc).toBeDefined();
    });
  });

  describe('PATCH /api/v1/readers/:id', () => {
    it('should return an error if reader id is not wrong format id', async () => {
      const response = await agent
        .patch('/api/v1/readers/1')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
    });

    it('should update a reader', async () => {
      const updatedFullName = 'Test ABC';
      const response = await agent
        .patch(`/api/v1/readers/${mockedReader._id}`)
        .send({ fullName: updatedFullName })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.doc.fullName).toBe(updatedFullName);
    });
  });
});
