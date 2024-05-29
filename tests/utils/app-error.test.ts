import { describe, it, expect } from '@jest/globals';
import AppError from '../../src/utils/app-error';

describe('AppError', () => {
  it('should create an AppError instance with defaults', () => {
    const error = new AppError();
    expect(error.message).toBe('Error');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should create an AppError instance with custom message and status code', () => {
    const message = 'Validation failed';
    const statusCode = 400;
    const error = new AppError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail'); // "fail" for 4xx code
    expect(error.isOperational).toBe(true);
  });

  it('should set status based on the statusCode prefix', () => {
    const testCases = [
      { message: 'Some error', statusCode: 200, expectedStatus: 'error' },
      { message: 'Not Found', statusCode: 404, expectedStatus: 'fail' },
      { message: 'Internal Error', statusCode: 500, expectedStatus: 'error' }
    ];

    for (const testCase of testCases) {
      const error = new AppError(testCase.message, testCase.statusCode);
      console.log(testCase.statusCode, testCase.expectedStatus);
      console.log(error.status);
      expect(error.status).toBe(testCase.expectedStatus);
    }
  });
});
