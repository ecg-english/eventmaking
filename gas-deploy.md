# 🚀 GAS + Vercel デプロイ完全ガイド

## 概要

このガイドでは、Google Apps Script (GAS) をバックエンド、Vercelをフロントエンドとして使用した完全無料のデプロイ方法を説明します。

## メリット

✅ **完全無料**
- GAS: 月100万回のリクエストまで無料
- Vercel: 個人利用は完全無料
- Google Sheets: データベースも無料

✅ **高可用性**
- Googleのインフラで動作
- 99.9%の可用性保証

✅ **簡単管理**
- Google Sheetsでデータを直接確認
- エクスポート・分析も簡単

## ステップ1: GASバックエンドのセットアップ

### 1.1 Google Apps Script プロジェクト作成

1. **Google Apps Script にアクセス**
   ```
   https://script.google.com/
   ```

2. **新しいプロジェクト作成**
   - 「新しいプロジェクト」をクリック
   - プロジェクト名を「イベント管理システム」に変更

3. **ファイル作成**
   - 左側の「+」ボタンをクリックして以下のファイルを作成：
     - `Code.gs`
     - `AuthService.gs`
     - `EventService.gs`
     - `DatabaseService.gs`

4. **コードのコピー**
   - 各ファイルに `gas-backend/` フォルダ内の対応するコードをコピー

### 1.2 環境変数設定

1. **プロジェクト設定を開く**
   - 左側の「プロジェクト設定」をクリック

2. **スクリプトプロパティを設定**
   - 「スクリプトプロパティ」タブを選択
   - 以下のプロパティを追加：

   ```
   JWT_SECRET = your-super-secret-key-here-2024
   CORS_ORIGIN = https://your-app-name.vercel.app
   ```

### 1.3 デプロイ

1. **新しいデプロイを作成**
   - 「デプロイ」→「新しいデプロイ」をクリック
   - 種類：「ウェブアプリ」
   - 説明：「イベント管理システム API v1.0」

2. **アクセス設定**
   - 次のユーザーとして実行：「自分」
   - アクセスできるユーザー：「全員」

3. **デプロイ実行**
   - 「デプロイ」をクリック
   - 承認を求められたら「許可」をクリック

4. **URLをコピー**
   - デプロイ後に表示されるURLをコピー
   - 例：`https://script.google.com/macros/s/AKfycbz.../exec`

## ステップ2: Vercelフロントエンドのセットアップ

### 2.1 Vercelアカウント作成

1. **Vercelにアクセス**
   ```
   https://vercel.com/
   ```

2. **GitHubアカウントでログイン**

### 2.2 プロジェクト作成

1. **GitHubリポジトリをインポート**
   - 「New Project」をクリック
   - GitHubリポジトリ「ecg-english/eventmaking」を選択

2. **プロジェクト設定**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2.3 環境変数設定

1. **Environment Variables を開く**
   - プロジェクト設定で「Environment Variables」タブを選択

2. **変数を追加**
   ```
   Name: REACT_APP_API_URL
   Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec/api
   Environment: Production, Preview, Development
   ```

### 2.4 デプロイ

1. **デプロイ実行**
   - 「Deploy」をクリック
   - ビルドが完了するまで待機

2. **URLを確認**
   - デプロイ後に表示されるURLをコピー
   - 例：`https://your-app-name.vercel.app`

## ステップ3: 最終設定

### 3.1 GASのCORS設定を更新

1. **GASプロジェクトに戻る**
2. **スクリプトプロパティを更新**
   ```
   CORS_ORIGIN = https://your-app-name.vercel.app
   ```

### 3.2 動作確認

1. **フロントエンドにアクセス**
   - VercelのURLにアクセス
   - アカウント作成・ログインをテスト

2. **API動作確認**
   - ブラウザの開発者ツールでネットワークタブを確認
   - APIリクエストが正常に動作しているか確認

## データベース管理

### Google Sheetsの確認

1. **スプレッドシートにアクセス**
   - GASプロジェクトの「プロジェクト設定」→「スクリプトプロパティ」
   - `SPREADSHEET_ID` の値をコピー

2. **スプレッドシートを開く**
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID
   ```

3. **データの確認**
   - `users` シート: ユーザー情報
   - `events` シート: イベント情報
   - `tasks` シート: タスク情報

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   ```
   解決方法: GASのCORS_ORIGIN設定を確認
   ```

2. **認証エラー**
   ```
   解決方法: JWT_SECRETが正しく設定されているか確認
   ```

3. **データベースエラー**
   ```
   解決方法: Google Sheetsの権限を確認
   ```

4. **ビルドエラー**
   ```
   解決方法: フロントエンドの依存関係を確認
   ```

## 運用・保守

### 定期メンテナンス

1. **ログ確認**
   - GASプロジェクトの「実行」タブでログを確認

2. **データバックアップ**
   - Google Sheetsを定期的にエクスポート

3. **パフォーマンス監視**
   - Vercel Analyticsでアクセス状況を確認

### セキュリティ

1. **JWT_SECRETの定期変更**
2. **Google Sheetsのアクセス権限確認**
3. **不要なデータの削除**

## コスト

### 無料枠の制限

- **GAS**: 月100万回のリクエスト
- **Vercel**: 個人利用は完全無料
- **Google Sheets**: 1GBまで無料

### 有料プランへの移行

必要に応じて以下に移行可能：
- **GAS**: 有料プラン（月$5〜）
- **Vercel**: Proプラン（月$20〜）
- **Google Sheets**: Google Workspace

## 完了！

これで完全無料で他の人と共有できるイベント管理システムが完成しました！

### アクセスURL
- **フロントエンド**: `https://your-app-name.vercel.app`
- **バックエンドAPI**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
- **データベース**: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID`

### 共有方法
1. フロントエンドURLを他の人に共有
2. アカウント作成して利用開始
3. データはGoogle Sheetsで管理・確認可能 