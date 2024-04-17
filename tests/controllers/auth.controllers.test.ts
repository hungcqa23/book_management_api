import { Request, Response, NextFunction } from 'express';
import authController from '../../src/controllers/auth.controllers';
import User from '../../src/models/schemas/user';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import AppError from '../../src/utils/appError';
import UserFinancials from '../../src/models/schemas/userFinancials';
import { IUser } from '../../src/models/interfaces/model.interfaces';

jest.mock('../../src/models/schemas/user');
jest.mock('../../src/models/schemas/userFinancials');

// Mock the createSendToken function
const { logIn, signUp } = authController;
console.log(authController.createSendToken);

describe('signUp controller', () => {
  // Set up
  let req: Request, res: Response, next: NextFunction;

  beforeEach(() => {
    req = { body: {} } as Request;
    res = {} as Response;
    next = jest.fn() as NextFunction;
  });

  it('should return a bad request error if email or password is not provided', async () => {
    await signUp(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Please provide email or password', 400));
  });

  it('should create a new user with valid data', async () => {
    req.body = {
      username: 'John Doe',
      email: '2lqyS@example.com',
      password: 'password',
      passwordConfirm: 'password'
    };

    // Mock User.create method
    (User.create as jest.Mock).mockReturnValueOnce({
      _id: '1234',
      username: 'John Doe',
      email: '2lqyS@example.com',
      password: 'password',
      passwordConfirm: 'password'
    } as IUser);

    (UserFinancials.create as jest.Mock).mockReturnValueOnce({
      user: '1234'
    });

    // Mock createSendToken
    await signUp(req, res, next);

    // Assertion
    expect(User.create).toHaveBeenCalledWith({
      username: 'John Doe',
      email: '2lqyS@example.com',
      password: 'password',
      passwordConfirm: 'password'
    });
    expect(UserFinancials.create).toHaveBeenCalledWith({ user: '1234' });
    expect(next).not.toHaveBeenCalled(); // No errors expected
  });
});

describe('logIn controller', () => {
  let req: Request, res: Response, next: NextFunction;
  beforeEach(() => {
    req = { body: {} } as Request;
    res = {} as Response;
    next = jest.fn() as NextFunction;
  });

  it('should return a bad request error if email or password is not provided', async () => {
    await logIn(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Please provide email or password', 400));
  });

  it('should return an unauthorized error if user does not provide credentials', async () => {
    (User.findOne as jest.Mock).mockImplementation(() => null);

    await logIn(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Please provide email or password', 401));
  });

  it('should return an unauthorized error if password is incorrect', async () => {
    req.body = { email: '2lqyS@example.com', password: 'password' };
    (User.findOne as jest.Mock).mockImplementation(() => ({
      comparePasswords: jest.fn(() => false),
      select: jest.fn()
    }));

    await logIn(req, res, next);
    expect(next).toHaveBeenCalledWith(new AppError('Incorrect password or email', 401));
  });
});

describe('createSendToken', () => {});
