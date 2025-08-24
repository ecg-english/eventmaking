/**
 * 認証サービス
 */
class AuthService {
  
  constructor() {
    this.db = new DatabaseService();
  }
  
  /**
   * ユーザー登録
   */
  register(email, name, password) {
    // メールアドレスの重複チェック
    const existingUser = this.db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    const userId = this.generateId();
    const hashedPassword = this.hashPassword(password);
    const now = new Date().toISOString();
    
    const user = {
      id: userId,
      email: email,
      name: name,
      password: hashedPassword,
      createdAt: now
    };
    
    this.db.createUser(user);
    
    // ログインしてトークンを返す
    return this.login(email, password);
  }
  
  /**
   * ログイン
   */
  login(email, password) {
    const user = this.db.getUserByEmail(email);
    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const isValidPassword = this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const token = this.generateToken(user.id);
    
    return { 
      user: this.sanitizeUser(user), 
      token: token 
    };
  }
  
  /**
   * 現在のユーザー情報取得
   */
  getCurrentUser(token) {
    const { userId } = this.verifyToken(token);
    const user = this.db.getUserById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    return this.sanitizeUser(user);
  }
  
  /**
   * ユーザー情報更新
   */
  updateUser(token, updates) {
    const { userId } = this.verifyToken(token);
    const user = this.db.getUserById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    // メールアドレスの重複チェック
    if (updates.email && updates.email !== user.email) {
      const existingUser = this.db.getUserByEmail(updates.email);
      if (existingUser) {
        throw new Error('このメールアドレスは既に使用されています');
      }
    }
    
    const updatedUser = this.db.updateUser(userId, updates);
    return this.sanitizeUser(updatedUser);
  }
  
  /**
   * パスワード変更
   */
  changePassword(token, currentPassword, newPassword) {
    const { userId } = this.verifyToken(token);
    const user = this.db.getUserById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    const isValidPassword = this.verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('現在のパスワードが正しくありません');
    }
    
    const hashedNewPassword = this.hashPassword(newPassword);
    this.db.updateUser(userId, { password: hashedNewPassword });
    
    return { message: 'パスワードが変更されました' };
  }
  
  /**
   * トークン検証
   */
  verifyToken(token) {
    try {
      // 簡易的なJWT実装（GASでは外部ライブラリが使えないため）
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('無効なトークン形式');
      }
      
      const payload = JSON.parse(Utilities.base64Decode(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        throw new Error('トークンの有効期限が切れています');
      }
      
      return { userId: payload.userId };
    } catch (error) {
      throw new Error('無効なトークンです');
    }
  }
  
  /**
   * パスワードハッシュ化
   */
  hashPassword(password) {
    // 簡易的なハッシュ化（本格的な実装ではbcrypt等を使用）
    return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password));
  }
  
  /**
   * パスワード検証
   */
  verifyPassword(password, hashedPassword) {
    const hashedInput = this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
  
  /**
   * JWTトークン生成
   */
  generateToken(userId) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      userId: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7日間
    };
    
    const encodedHeader = Utilities.base64Encode(JSON.stringify(header));
    const encodedPayload = Utilities.base64Encode(JSON.stringify(payload));
    
    // 簡易的な署名（実際のJWTではHMAC-SHA256を使用）
    const signature = Utilities.base64Encode(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256, 
        encodedHeader + '.' + encodedPayload + JWT_SECRET
      )
    );
    
    return encodedHeader + '.' + encodedPayload + '.' + signature;
  }
  
  /**
   * ID生成
   */
  generateId() {
    return Utilities.getUuid();
  }
  
  /**
   * ユーザー情報からパスワードを除去
   */
  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
} 