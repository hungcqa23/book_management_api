import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import http from 'http';
import app from '../../src/app';
import { SuperAgentTest, SuperTest } from 'supertest';
import MongoDB from '../../src/utils/mongodb';
import { mockedAdmin, mockedBook, mockedBorrowCard, mockedReturnCard } from '../data/mocked-data';
import Book from '../../src/models/schemas/book';
import BorrowBookForm from '../../src/models/schemas/borrow-book-form';
import ReturnBookForm from '../../src/models/schemas/return-book-form';

describe('Returning Book Form', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;

  beforeAll(async () => {
    server = app.listen(8000);
    agent = request.agent(server);
    await MongoDB.getInstance().newConnection();
    await Book.create(mockedBook);
    await BorrowBookForm.create(mockedBorrowCard);

    // Log in the user to get the token
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send(mockedAdmin)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    token = loginResponse.body.token;
  }, 15000);

  afterAll(async () => {
    await Book.findByIdAndDelete(mockedBook._id);
    await ReturnBookForm.findOneAndDelete({ _id: mockedReturnCard._id });
    await MongoDB.getInstance().closeConnection();

    server.close();
  }, 10000);

  describe('POST /api/v1/borrow-book-forms/:borrowBookFormId/return-book-forms', () => {
    it('should create a new return book form', async () => {
      try {
        const response = await agent
          .post(`/api/v1/borrow-book-forms/${mockedBorrowCard._id}/return-book-forms`)
          .send(mockedReturnCard)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.data.doc).toBeDefined();
      } catch (error) {
        console.log(error);
      }
    });
  });
});
