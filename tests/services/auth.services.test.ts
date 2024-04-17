import authService from '../../src/services/auth.services';
import bcrypt from 'bcrypt';
import { describe, it, expect, jest } from '@jest/globals';

// Mock bcrypt.compare to simulate its behavior

describe('AuthServices', () => {
  describe('correctPassword', () => {
    it('should return true if the password is correct', async () => {
      // Arrange
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10); // Generate hashed password
      // Mock bcrypt.compare to resolve true
      expect(await authService.correctPassword(password, hashedPassword)).toBe(true);
    });

    it('should return false if the password is incorrect', async () => {
      // Arrange
      const password = 'password123';
      const incorrectPassword = 'wrongpassword';

      // Act
      const result = await authService.correctPassword(password, incorrectPassword);
      // Assert
      expect(result).toBe(false);
    });
  });
});
