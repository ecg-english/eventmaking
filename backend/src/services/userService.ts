import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/connection';
import { User, UserWithoutPassword } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export class UserService {
  
  async createUser(email: string, name: string, password: string): Promise<UserWithoutPassword> {
    // メールアドレスの重複チェック
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO users (id, email, name, password, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await database.run(sql, [id, email, name, hashedPassword, now]);
    
    return this.sanitizeUser(await this.getUserById(id));
  }

  async authenticateUser(email: string, password: string): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const token = this.generateToken(user.id);
    
    return { user: this.sanitizeUser(user), token };
  }

  async getUserById(id: string): Promise<User> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const row = await database.get(sql, [id]);
    
    if (!row) {
      throw new Error('ユーザーが見つかりません');
    }
    
    return this.mapDbRowToUser(row);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const row = await database.get(sql, [email]);
    
    return row ? this.mapDbRowToUser(row) : null;
  }

  async updateUser(id: string, updates: { name?: string; email?: string }): Promise<UserWithoutPassword> {
    const updateFields = [];
    const values = [];
    
    if (updates.name) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.email) {
      // メールアドレスの重複チェック
      const existingUser = await this.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('このメールアドレスは既に使用されています');
      }
      updateFields.push('email = ?');
      values.push(updates.email);
    }
    
    if (updateFields.length === 0) {
      return this.sanitizeUser(await this.getUserById(id));
    }
    
    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await database.run(sql, values);
    
    return this.sanitizeUser(await this.getUserById(id));
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(id);
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('現在のパスワードが正しくありません');
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await database.run(sql, [hashedNewPassword, id]);
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('無効なトークンです');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  private mapDbRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      password: row.password,
      createdAt: row.created_at
    };
  }

  public sanitizeUser(user: User): UserWithoutPassword {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
} 