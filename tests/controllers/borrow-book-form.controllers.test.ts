import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import app from '../../src/app';
import request from 'supertest';
import { SuperAgentTest, SuperTest } from 'supertest';
import MongoDB from '../../src/utils/mongodb';
import Book from '../../src/models/schemas/book';
import { mockedBook, mockedBorrowCard } from '../data/mocked-data';
import BorrowBookForm from '../../src/models/schemas/borrow-book-form';

describe('Borrow Book Form Controllers', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;
  let tokenNotReader: string;

  beforeAll(async () => {
    server = app.listen(8000);
    agent = request.agent(server);
    await MongoDB.getInstance().newConnection();
    await Book.create(mockedBook);

    // Log in the user that don't have reader card
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send({ email: 'testingadmin@gmail.com.vn', password: '123456789' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    token = loginResponse.body.token;

    // Log in the user that don't have reader card
    const loginResponse2 = await agent
      .post('/api/v1/users/login')
      .send({ email: 'anbeel191@gmail.com', password: '12345678910' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    tokenNotReader = loginResponse2.body.token;
  }, 15000);

  afterAll(async () => {
    await Book.findByIdAndDelete(mockedBook._id);
    const error = await BorrowBookForm.findByIdAndDelete(mockedBorrowCard._id);
    console.log('Hello World!');
    console.log(error);
    server.close();
  }, 15000);

  describe('POST /api/v1/borrow-book-forms', () => {
    it('should return an error if user does not have reader card', async () => {
      const response = await agent
        .post('/api/v1/borrow-book-forms')
        .send({
          books: [
            {
              _id: mockedBook._id,
              quantity: 1
            }
          ]
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenNotReader}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Please create a reader card!');
    });

    it('should create a new borrow book form', async () => {
      const response = await agent
        .post('/api/v1/borrow-book-forms')
        .send(mockedBorrowCard)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.data.doc).toBeDefined();
    });
  });
});
