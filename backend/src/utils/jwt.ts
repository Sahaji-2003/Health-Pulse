import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE || '7d';

  // amazonq-ignore-next-line
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: expire as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    // amazonq-ignore-next-line
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  // amazonq-ignore-next-line
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
