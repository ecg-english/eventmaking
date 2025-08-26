# イベント管理システム

イベントの企画から実施まで一連の流れを効率的に管理するウェブアプリケーション

## 主な機能

- **イベント企画管理**: 企画書の作成・編集・保存
- **タスクスケジューラー**: 各段階のタスクとデッドライン管理
- **進捗トラッキング**: チェックリスト機能で抜け漏れ防止
- **SNS投稿管理**: マルチプラットフォーム投稿スケジュール
- **ダッシュボード**: 全体の進捗状況を一目で確認

## 技術スタック

- **フロントエンド**: React, TypeScript, Material-UI
- **バックエンド**: Google Apps Script (GAS)
- **データベース**: Google Sheets
- **認証**: JWT
- **デプロイ**: GitHub Pages (フロントエンド) + GAS (バックエンド)
- **総コスト**: ¥0

## セットアップ

### ローカル開発

1. 依存関係のインストール:
```bash
npm run install-deps
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで `http://localhost:3000` にアクセス

### 本番デプロイ

詳細なデプロイ手順は [gas-deploy.md](./gas-deploy.md) を参照してください。

#### 推奨デプロイ方法
- **フロントエンド**: GitHub Pages (完全無料)
- **バックエンド**: Google Apps Script (完全無料)
- **データベース**: Google Sheets (完全無料)

## アクセスURL

- **フロントエンド**: https://ecg-english.github.io/eventmaking
- **バックエンド**: https://script.google.com/macros/s/AKfycbwK28csyuvdqHrqmh-nnCB9MyLOo77Ig-vGS4GeAZnM9RtwNObYTV9Nk3rHmidYJddD/exec
- **GitHub**: https://github.com/ecg-english/eventmaking

## イベント作成フロー

1. 企画書作成（一ヶ月前）
2. フライヤー作成（一ヶ月前）
3. コミュニティアプリ投稿（一ヶ月前）
4. Instagram投稿（一ヶ月前）
5. 公式LINE予約投稿（一ヶ月前）
6. フライヤー印刷・店舗張り出し（一ヶ月前）
7. Meetup投稿（一週間前）
8. ストーリー投稿（一週間前）
9. ストーリー再投稿（前日）
10. 実施・反省会（当日）

## 開発者向け情報

### 自動デプロイ
- GitHubのmainブランチにプッシュすると自動的にGitHub Pagesにデプロイされます
- GASバックエンドは手動でデプロイが必要です

### 環境変数
- `REACT_APP_API_URL`: GASバックエンドのURL
- `JWT_SECRET`: GASのスクリプトプロパティで設定
- `CORS_ORIGIN`: GASのスクリプトプロパティで設定

## 🚀 今すぐ始める（GASバックエンド設定）

### 1. GASプロジェクトの作成
1. [Google Apps Script](https://script.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を「EventManagementBackend」に設定

### 2. ファイルの追加
以下の4つのファイルをGASエディタに追加：
- `Code.gs` (メインエントリーポイント)
- `AuthService.gs` (認証サービス)
- `EventService.gs` (イベント管理サービス)
- `DatabaseService.gs` (データベースサービス)

### 3. スクリプトプロパティの設定
1. プロジェクト設定 → スクリプトプロパティ
2. 以下のプロパティを追加：
   - `JWT_SECRET`: `eventmaking-secret-key-2024-a1b2c3d4e5f6g7h8i9j0`
   - `CORS_ORIGIN`: `https://ecg-english.github.io`

### 4. デプロイ
1. 「デプロイ」→「新しいデプロイ」
2. 種類：「ウェブアプリ」
3. アクセス権：「全員」
4. デプロイ実行

### 5. フロントエンドの設定
1. ローカル開発用: `.env.local`ファイルを作成
2. 本番環境用: ビルド時にAPI URLを設定

詳細な手順は [github-pages-deploy.md](./github-pages-deploy.md) を参照してください。 