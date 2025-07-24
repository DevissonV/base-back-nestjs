import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt with 10 salt rounds.
 * @param password - Raw password in plain text.
 * @returns Promise that resolves with the hashed string.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password against a hashed password.
 * @param plainText - Raw password provided by the user.
 * @param hash - Stored hashed password to compare against.
 * @returns Promise that resolves to true if passwords match.
 */
export async function comparePasswords(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}