import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../src/utils/catch-async'; // Assuming catchAsync is in this path
import { describe, it, expect, jest } from '@jest/globals';

// Define a type to represent the function passed to catchAsync
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

describe('catchAsync', () => {
  it('should call the provided function and catch any errors', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined as never); // Example resolved value
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await catchAsync(mockFn as AsyncFunction)(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled(); // Since the function resolves successfully, next should not be called
  });

  it('should call the error handling middleware if the provided function throws an error', async () => {
    const errorMessage = 'An error occurred';
    const error = new Error(errorMessage);

    const mockFn = jest.fn().mockRejectedValue(error as never);
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await catchAsync(mockFn as AsyncFunction)(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Expecting the error to be passed to the next middleware
  });
});
