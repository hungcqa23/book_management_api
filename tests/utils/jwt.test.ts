import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../../src/utils/jwt';
import { describe, it, expect } from '@jest/globals';

describe('JWT Functions', () => {
  const secretToken = 'yourSecretToken';

  describe('signToken', () => {
    it('should return a valid token when all parameters are provided', () => {
      const id = 'someUserId';
      const expiresIn = '1h';
      const token = signToken(id, secretToken, expiresIn);
      expect(token).toBeDefined();
    });

    it('should throw an error if expiresIn format is invalid', () => {
      expect(() => signToken('someUserId', secretToken, 'invalidFormat')).toThrow(
        'expiresIn format is invalid'
      );
    });

    // Add more test cases for different scenarios if needed
  });

  describe('verifyToken', () => {
    it('should reject an invalid token', async () => {
      const invalidToken = 'invalidToken';
      await expect(verifyToken(invalidToken, secretToken)).rejects.toThrow('jwt malformed');
    });

    it('should reject an expired token', async () => {
      const expiredToken = jwt.sign({ id: 'someUserId' }, secretToken, { expiresIn: '0s' });
      await expect(verifyToken(expiredToken, secretToken)).rejects.toThrow('jwt expired');
    });

    it('should reject a token with incorrect signature', async () => {
      const token = jwt.sign({ id: 'someUserId' }, 'wrongSecretToken', { expiresIn: '1h' });
      await expect(verifyToken(token, secretToken)).rejects.toThrow('invalid signature');
    });

    it('should reject a token with invalid format', async () => {
      const invalidFormatToken = 'invalidTokenFormat';
      await expect(verifyToken(invalidFormatToken, secretToken)).rejects.toThrow('jwt malformed');
    });

    it('should reject a token with expired time format "0s"', async () => {
      const expiredToken = jwt.sign({ id: 'someUserId' }, secretToken, { expiresIn: '0s' });
      await expect(verifyToken(expiredToken, secretToken)).rejects.toThrow('jwt expired');
    });

    it('should reject a token with expired time format "0m"', async () => {
      const expiredToken = jwt.sign({ id: 'someUserId' }, secretToken, { expiresIn: '0m' });
      await expect(verifyToken(expiredToken, secretToken)).rejects.toThrow('jwt expired');
    });

    it('should reject a token with expired time format "0h"', async () => {
      const expiredToken = jwt.sign({ id: 'someUserId' }, secretToken, { expiresIn: '0h' });
      await expect(verifyToken(expiredToken, secretToken)).rejects.toThrow('jwt expired');
    });
  });
});
