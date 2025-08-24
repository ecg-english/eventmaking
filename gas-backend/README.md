# 🚀 GASバックエンド セットアップ手順

## 概要

Google Apps Script (GAS) を使用した完全無料のバックエンドAPIです。
Google Sheetsをデータベースとして使用し、月100万回のリクエストまで無料で利用できます。

## セットアップ手順

### 1. Google Apps Script プロジェクト作成

1. **Google Apps Script にアクセス**
   - https://script.google.com/ にアクセス
   - Googleアカウントでログイン

2. **新しいプロジェクト作成**
   - 「新しいプロジェクト」をクリック
   - プロジェクト名を「イベント管理システム」に変更

3. **ファイル作成**
   - 以下の4つのファイルを作成：
     - `Code.gs` (メインコード)
     - `AuthService.gs` (認証サービス)
     - `EventService.gs` (イベントサービス)
     - `DatabaseService.gs` (データベースサービス)

4. **コードのコピー**
   - 各ファイルに `gas-backend/` フォルダ内の対応するコードをコピー

### 2. 環境変数設定

1. **プロジェクト設定を開く**
   - 左側の「プロジェクト設定」をクリック

2. **スクリプトプロパティを設定**
   - 「スクリプトプロパティ」タブを選択
   - 以下のプロパティを追加：

```
JWT_SECRET = your-secret-key-here
CORS_ORIGIN = https://your-frontend-url.vercel.app
```

### 3. デプロイ

1. **新しいデプロイを作成**
   - 「デプロイ」→「新しいデプロイ」をクリック
   - 種類：「ウェブアプリ」
   - 説明：「イベント管理システム API」

2. **アクセス設定**
   - 次のユーザーとして実行：「自分」
   - アクセスできるユーザー：「全員」

3. **デプロイ実行**
   - 「デプロイ」をクリック
   - 承認を求められたら「許可」をクリック

4. **URLをコピー**
   - デプロイ後に表示されるURLをコピー
   - 例：`https://script.google.com/macros/s/AKfycbz.../exec`

### 4. フロントエンド設定

1. **環境変数を更新**
   - フロントエンドの環境変数でAPI URLを更新：
   ```
   REACT_APP_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec/api
   ```

2. **Vercelでデプロイ**
   - GitHubリポジトリをVercelに接続
   - 環境変数を設定
   - デプロイ実行

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー情報
- `PUT /api/auth/me` - ユーザー情報更新
- `PUT /api/auth/change-password` - パスワード変更

### イベント
- `GET /api/events` - イベント一覧
- `GET /api/events/:id` - イベント詳細
- `POST /api/events` - イベント作成
- `PUT /api/events/:id` - イベント更新
- `DELETE /api/events/:id` - イベント削除

### タスク
- `GET /api/events/:id/tasks` - タスク一覧
- `POST /api/events/:id/tasks` - タスク作成
- `PUT /api/events/tasks/:taskId` - タスク更新
- `DELETE /api/events/tasks/:taskId` - タスク削除

### その他
- `GET /api/health` - ヘルスチェック

## データベース構造

Google Sheetsに以下のシートが自動作成されます：

### users シート
| id | email | name | password | createdAt |
|----|-------|------|----------|-----------|

### events シート
| id | title | description | eventDate | createdAt | updatedAt | status | userId |
|----|-------|-------------|-----------|-----------|-----------|--------|--------|

### tasks シート
| id | eventId | title | description | dueDate | completed | taskType | createdAt | updatedAt | priority |
|----|---------|-------|-------------|---------|-----------|----------|-----------|-----------|----------|

## セキュリティ

- JWT認証によるセッション管理
- パスワードのSHA-256ハッシュ化
- CORS設定によるアクセス制御
- ユーザー所有権チェック

## 制限事項

- GASの実行時間制限（6分）
- リクエストサイズ制限（50MB）
- 同時実行数制限（100）

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   - CORS_ORIGIN設定を確認
   - フロントエンドURLが正しく設定されているか確認

2. **認証エラー**
   - JWT_SECRETが正しく設定されているか確認
   - トークンの有効期限を確認

3. **データベースエラー**
   - Google Sheetsの権限を確認
   - スプレッドシートが正しく作成されているか確認

## メリット

✅ **完全無料**
- 月100万回のリクエストまで無料
- データベース（Google Sheets）も無料

✅ **簡単セットアップ**
- コードをコピーするだけ
- 環境変数設定も最小限

✅ **高可用性**
- Googleのインフラで動作
- 99.9%の可用性

✅ **スケーラブル**
- 必要に応じて有料プランに移行可能

✅ **データ可視化**
- Google Sheetsでデータを直接確認可能
- エクスポート・分析も簡単 