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
- **デプロイ**: Vercel (フロントエンド) + GAS (バックエンド)

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
- **フロントエンド**: Vercel (自動デプロイ)
- **バックエンド**: Google Apps Script
- **データベース**: Google Sheets

## アクセスURL

- **本番環境**: https://eventmaking-1asxnmi4y-nauticalimiles-projects.vercel.app
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
- GitHubのmainブランチにプッシュすると自動的にVercelにデプロイされます
- GASバックエンドは手動でデプロイが必要です

### 環境変数
- `REACT_APP_API_URL`: GASバックエンドのURL
- `JWT_SECRET`: GASのスクリプトプロパティで設定
- `CORS_ORIGIN`: GASのスクリプトプロパティで設定 