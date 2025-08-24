# 🚀 デプロイ手順書

## 推奨デプロイ方法: Vercel + Railway

### 1. バックエンド (Railway)

1. **Railwayアカウント作成**
   - https://railway.app/ にアクセス
   - GitHubアカウントでログイン

2. **プロジェクト作成**
   ```bash
   # Railway CLIをインストール
   npm install -g @railway/cli
   
   # ログイン
   railway login
   
   # プロジェクト初期化
   cd backend
   railway init
   ```

3. **環境変数設定**
   - Railwayダッシュボードで以下を設定:
   ```
   JWT_SECRET=your-secret-key-here
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **デプロイ**
   ```bash
   railway up
   ```

### 2. フロントエンド (Vercel)

1. **Vercelアカウント作成**
   - https://vercel.com/ にアクセス
   - GitHubアカウントでログイン

2. **プロジェクト作成**
   - GitHubリポジトリをインポート
   - ルートディレクトリを `frontend` に設定

3. **環境変数設定**
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   ```

4. **デプロイ**
   - GitHubにプッシュすると自動デプロイ

## 代替方法: Heroku

### 1. バックエンド (Heroku)

1. **Herokuアカウント作成**
   - https://heroku.com/ にアクセス

2. **Heroku CLIインストール**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # ログイン
   heroku login
   ```

3. **アプリケーション作成**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **環境変数設定**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **デプロイ**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### 2. フロントエンド (Vercel)

上記と同じ手順

## データベース設定

### Railway (推奨)
- RailwayでPostgreSQLを追加
- 環境変数 `DATABASE_URL` が自動設定される

### Heroku
```bash
heroku addons:create heroku-postgresql:mini
```

## セキュリティ設定

1. **JWT_SECRET**
   - 強力なランダム文字列を生成
   - 例: `openssl rand -base64 32`

2. **CORS設定**
   - 本番環境のフロントエンドURLのみ許可

3. **環境変数**
   - 機密情報は環境変数で管理
   - リポジトリにコミットしない

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   - フロントエンドURLが正しく設定されているか確認

2. **データベース接続エラー**
   - DATABASE_URLが正しく設定されているか確認

3. **ビルドエラー**
   - TypeScriptコンパイルエラーを確認
   - 依存関係が正しくインストールされているか確認

## 本番環境での注意点

1. **ログ管理**
   - エラーログを適切に監視

2. **パフォーマンス**
   - データベースクエリの最適化
   - キャッシュの活用

3. **バックアップ**
   - 定期的なデータベースバックアップ

4. **監視**
   - アプリケーションの可用性監視
   - レスポンス時間の監視 