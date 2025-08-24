import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'アクセストークンが必要です' });
      return;
    }

    const { userId } = userService.verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(403).json({ error: '無効なトークンです' });
  }
}; 