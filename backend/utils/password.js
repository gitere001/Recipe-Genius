import bcrypt from 'bcrypt';

export const verifyPassword = async (enteredPassword, storedHashedPassword) => {
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
};
