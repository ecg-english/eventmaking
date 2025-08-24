import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/events.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// データディレクトリが存在しない場合は作成
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('データベース接続エラー:', err.message);
      } else {
        console.log('SQLiteデータベースに接続しました');
        this.initializeSchema();
      }
    });
  }

  private async initializeSchema(): Promise<void> {
    try {
      const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
      
      // スキーマを実行（複数のCREATE文を分割して実行）
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await this.run(statement);
        }
      }
      
      console.log('データベーススキーマを初期化しました');
    } catch (error) {
      console.error('スキーマ初期化エラー:', error);
    }
  }

  public run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('データベースクローズエラー:', err.message);
      } else {
        console.log('データベース接続を閉じました');
      }
    });
  }
}

export const database = new Database(); 