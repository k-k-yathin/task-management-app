import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.cookie('token', result.token, cookieOptions);
      res.status(201).json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.cookie('token', result.token, cookieOptions);
      res.json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('token', cookieOptions);
    res.json({ message: 'Logged out successfully' });
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
};
