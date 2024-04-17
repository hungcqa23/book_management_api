export const calculateAge = (dateOfBirth: Date): number => {
  const now = new Date();
  if (dateOfBirth > now) {
    return 0; // Return 0 for future dates of birth
  }

  const ageInMilliseconds = now.getTime() - dateOfBirth.getTime();
  const ageInYear = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(ageInYear);
};
