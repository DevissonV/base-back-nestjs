import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt with 10 salt rounds.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}