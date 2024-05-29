import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import app from '../../src/app';
import request, { SuperAgentTest } from 'supertest';
import http from 'http';
import { NextFunction, Request, Response } from 'express';
import Book from '../../src/models/schemas/book';
import MongoDB from '../../src/utils/mongodb';
import { after } from 'node:test';

describe('POST to login route', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;

  const mockedBook = {
    _id: '649103b96b87475f3b0633cc',
    nameBook: 'The Catcher in the Rye 6',
    typeBook: 'A',
    author: 'J.D. Salinger',
    publicationYear: 2023,
    publisher: 'Little, Brown and Company',
    price: '10.99',
    description:
      'The Catcher in the Rye is a novel by J.D. Salinger, first published in 1951. It is known for its distinctive narrative voice and controversial themes, and is widely regarded as a classic of 20th-century American literature.',
    language: 'English',
    pages: 200
  };

  beforeAll(async () => {
    MongoDB.getInstance().newConnection();
    server = app.listen(8000);
    agent = request.agent(server);

    // Log in the user to get the token
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send({ email: 'testingadmin@gmail.com.vn', password: '123456789' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    token = loginResponse.body.token;
  }, 15000);

  afterAll(async () => {
    server.close();
    await MongoDB.getInstance().closeConnection();
  }, 10000);

  describe('GET /api/v1/books', () => {
    it('should return a list of books', async () => {
      const response = await agent
        .get('/api/v1/books')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.doc.length).toBeGreaterThan(0);
    }, 30000);
  });

  describe('GET /api/v1/books/:id', () => {
    afterAll(async () => {
      await Book.findOneAndDelete({ _id: mockedBook._id });
    });
    it('should return an error if book id is not wrong format', async () => {
      const response = await agent
        .get('/api/v1/books/1')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
    }, 30000);

    it('should return a book', async () => {
      const response = await agent
        .get('/api/v1/books/649103b96b87475f3b0633ae')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.doc).toBeDefined();
    }, 30000);
  });

  describe('POST /api/v1/books', () => {
    it('should create a new book', async () => {
      let bookId: string = '';
      // try {
      const response = await agent
        .post('/api/v1/books')
        .send(mockedBook)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.data.doc).toBeDefined();
    }, 30000);

    it('should return an error if book already exists', async () => {
      const response = await agent
        .post('/api/v1/books')
        .send(mockedBook)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(409);
    }, 30000);
  });
});
