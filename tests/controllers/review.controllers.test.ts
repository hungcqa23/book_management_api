import request, { SuperAgentTest } from 'supertest';
import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import app from '../../src/app';
import http from 'http';
import MongoDB from '../../src/utils/mongodb';
import Book from '../../src/models/schemas/book';
import mongoose from 'mongoose';
import Review from '../../src/models/schemas/review';

describe('/api/v1/:bookId/reviews', () => {
  let server: http.Server;
  let agent: SuperAgentTest;
  let token: string;
  const mockedBook = {
    _id: '665768b789fd2498f549079b',
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

  const mockedReview = {
    _id: '665768c0f4d66b6ef02916cf',
    review: 'The Catcher in the Rye 6'
  };

  const test_account = {
    email: 'anbeel@gmail.com',
    password: '123456789'
  };

  beforeAll(async () => {
    await MongoDB.getInstance().newConnection();
    server = app.listen(8000);
    agent = request.agent(server);

    await Book.create(mockedBook);

    // Log in the user to get the token
    const loginResponse = await agent
      .post('/api/v1/users/login')
      .send(test_account)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    token = loginResponse.body.token;
  }, 15000);

  afterAll(async () => {
    await Book.findByIdAndDelete(mockedBook._id);
    await MongoDB.getInstance().closeConnection();
    server.close();
  });

  describe('POST /api/v1/:bookId/reviews', () => {
    it('should return an error if book id is not wrong format', async () => {
      const response = await agent
        .post('/api/v1/books/1/reviews')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ _id: '649103b96b87475f3b0633cc', review: 'The Catcher in the Rye 6' });
      expect(response.status).toBe(409);
    }, 30000);

    it('should create a new review', async () => {
      const response = await agent
        .post(`/api/v1/books/${mockedBook._id}/reviews`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(mockedReview);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('Created successfully.');
    }, 30000);
  });

  describe('GET /api/v1/:bookId/reviews', () => {
    it('should return an error if book id is not wrong format', async () => {
      const response = await agent
        .get('/api/v1/books/1/reviews')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
    }, 30000);

    it('should return a list of reviews', async () => {
      const response = await agent
        .get(`/api/v1/books/${mockedBook._id}/reviews`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      console.log(response.status);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    }, 30000);

    it;
  });

  describe('PATCH /api/v1/:bookId/reviews/:reviewId', () => {
    it('should return an error if book id is not wrong format', async () => {
      const response = await agent
        .patch('/api/v1/books/1/reviews/1')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
    }, 30000);

    it('should update a review', async () => {
      const response = await agent
        .patch(`/api/v1/reviews/${mockedReview._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ review: 'The Catcher in the Rye 6' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Updated successfully.');
    }, 30000);
  });

  describe('DELETE /api/v1/:bookId/reviews/:reviewId', () => {
    it('should return an error if book id is not wrong format', async () => {
      const response = await agent
        .delete('/api/v1/books/1/reviews/1')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
    }, 30000);

    it('should delete a review', async () => {
      console.log(`/api/v1/reviews/${mockedReview._id.toString()}`);
      const response = await agent
        .delete(`/api/v1/reviews/${mockedReview._id.toString()}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    }, 30000);
  });
});
