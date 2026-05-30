import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token as string | undefined;

    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};
