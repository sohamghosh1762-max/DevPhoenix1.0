import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devphoenix-default-secret-key-2026';

export interface TokenPayload {
  studentCode: string;
  id: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
