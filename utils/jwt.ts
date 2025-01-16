import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret';

export function signToken(payload: object, expiresIn = '1h') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
