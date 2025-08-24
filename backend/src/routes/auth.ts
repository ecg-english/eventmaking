import express from 'express';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { UserWithoutPassword } from '../types';

const router = express.Router();
const userService = new UserService();

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'メールアドレス、名前、パスワードは必須です' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'パスワードは6文字以上である必要があります' });
    }
    
    const user = await userService.createUser(email, name, password);
    const { token } = await userService.authenticateUser(email, password);
    
    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードは必須です' });
    }
    
    const { user, token } = await userService.authenticateUser(email, password);
    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// 現在のユーザー情報取得
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await userService.getUserById(req.userId!);
    const sanitizedUser = userService.sanitizeUser(user);
    res.json(sanitizedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ユーザー情報更新
router.put('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.updateUser(req.userId!, { name, email });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// パスワード変更
router.put('/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '現在のパスワードと新しいパスワードは必須です' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新しいパスワードは6文字以上である必要があります' });
    }
    
    await userService.changePassword(req.userId!, currentPassword, newPassword);
    res.json({ message: 'パスワードが変更されました' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 