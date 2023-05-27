export const calculateAge = (dateOfBirth: Date): number => {
  const ageInMilliseconds = Date.now() - dateOfBirth.getTime();
  const ageInYear = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(ageInYear);
};
