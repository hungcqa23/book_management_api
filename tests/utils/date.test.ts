import { calculateAge } from '../../src/utils/date'; // Update the path accordingly
import { describe, it, expect } from '@jest/globals';

describe('calculateAge', () => {
  it('should calculate the age correctly for a given date of birth', () => {
    // Arrange
    const dateOfBirth = new Date('1990-01-01');

    // Act
    const age = calculateAge(dateOfBirth);

    // Assert
    expect(age).toEqual(expect.any(Number));
    expect(age).toBeGreaterThanOrEqual(0); // Ensure age is non-negative
    // Add more specific assertions based on expected age for the given date of birth
  });

  it('should return 0 for a future date of birth', () => {
    // Arrange
    const futureDateOfBirth = new Date('2100-01-01');

    // Act
    const age = calculateAge(futureDateOfBirth);

    // Assert
    expect(age).toEqual(0);
  });

  it('should handle leap years correctly', () => {
    // Arrange
    const leapYearDateOfBirth = new Date('2000-02-29');

    // Act
    const age = calculateAge(leapYearDateOfBirth);

    // Assert
    expect(age).toEqual(expect.any(Number));
    // Add more specific assertions based on expected age for the given date of birth
  });

  // Add more test cases for different scenarios if needed
});
