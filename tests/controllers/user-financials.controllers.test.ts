import request, { SuperAgentTest } from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../../src/app';
import http from 'http';
import { mockedAdmin } from '../data/mocked-data';

describe('User Financials Controller', () => {
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

  it('should get list of user financials', async () => {
    const response = await agent
      .get('/api/v1/user-financials')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.doc.length).toBeGreaterThan(0);
  });

  it('should get my user financials', async () => {
    const response = await agent
      .get('/api/v1/user-financials/me')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userFinancials).toBeDefined();
  });
});
