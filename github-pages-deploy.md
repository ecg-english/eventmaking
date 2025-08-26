# GitHub Pages + GAS 完全無料デプロイガイド

このガイドでは、Vercelを使わずにGitHub PagesとGoogle Apps Script (GAS)を使用して完全無料でイベント管理システムをデプロイする方法を説明します。

## 🎯 概要

- **フロントエンド**: GitHub Pages (無料)
- **バックエンド**: Google Apps Script (無料)
- **データベース**: Google Sheets (無料)
- **総コスト**: ¥0

## 📋 前提条件

- GitHubアカウント
- Googleアカウント
- Node.js (ローカル開発用)

## 🚀 デプロイ手順

### 1. GitHub Pagesの設定

#### 1.1 リポジトリ設定
1. GitHubリポジトリページにアクセス
2. Settings → Pages
3. Source: "GitHub Actions" を選択
4. 保存

#### 1.2 フロントエンドのデプロイ
```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係をインストール
npm install

# GitHub Pagesにデプロイ
npm run deploy
```

### 2. GASバックエンドの設定

#### 2.1 GASプロジェクトの作成
1. [Google Apps Script](https://script.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を「EventManagementBackend」に設定

#### 2.2 ファイルの追加
以下の4つのファイルをGASエディタに追加：

**Code.gs** (メインエントリーポイント)
```javascript
// gas-backend/Code.gs の内容をコピー
```

**AuthService.gs** (認証サービス)
```javascript
// gas-backend/AuthService.gs の内容をコピー
```

**EventService.gs** (イベント管理サービス)
```javascript
// gas-backend/EventService.gs の内容をコピー
```

**DatabaseService.gs** (データベースサービス)
```javascript
// gas-backend/DatabaseService.gs の内容をコピー
```

#### 2.3 スクリプトプロパティの設定
1. プロジェクト設定 → スクリプトプロパティ
2. 以下のプロパティを追加：
   - `JWT_SECRET`: `eventmaking-secret-key-2024-a1b2c3d4e5f6g7h8i9j0`
   - `CORS_ORIGIN`: `https://ecg-english.github.io`

#### 2.4 デプロイ
1. 「デプロイ」→「新しいデプロイ」
2. 種類：「ウェブアプリ」
3. アクセス権：「全員」
4. デプロイ実行
5. **デプロイURLをコピー** (例: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 3. フロントエンドの環境変数設定

#### 3.1 ローカル開発用
```bash
# frontendディレクトリで.env.localファイルを作成
echo "REACT_APP_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec/api" > .env.local
```

#### 3.2 本番環境用
GitHub Pagesでは環境変数が使えないため、ビルド時にAPI URLを設定します：

```bash
# ビルド時に環境変数を設定
REACT_APP_API_URL=https://script.google.com/macros/s/AKfycbwK28csyuvdqHrqmh-nnCB9MyLOo77Ig-vGS4GeAZnM9RtwNObYTV9Nk3rHmidYJddD/exec/api npm run build
```

### 4. 自動デプロイの設定

#### 4.1 GitHub Actionsの有効化
1. リポジトリのSettings → Actions → General
2. "Allow all actions and reusable workflows" を選択
3. 保存

#### 4.2 ワークフローの確認
`.github/workflows/deploy-pages.yml` が正しく設定されていることを確認

### 5. 最終デプロイ

```bash
# 変更をコミット・プッシュ
git add .
git commit -m "Setup GitHub Pages + GAS deployment"
git push

# GitHub Actionsが自動的にデプロイを実行
```

## 🔗 アクセスURL

- **フロントエンド**: https://ecg-english.github.io/eventmaking
- **バックエンド**: https://script.google.com/macros/s/AKfycbwK28csyuvdqHrqmh-nnCB9MyLOo77Ig-vGS4GeAZnM9RtwNObYTV9Nk3rHmidYJddD/exec

## 🧪 テスト

### 1. フロントエンドのテスト
1. https://ecg-english.github.io/eventmaking にアクセス
2. アカウント作成・ログインをテスト
3. イベント作成機能をテスト

### 2. バックエンドのテスト
1. GASエディタで「実行」→「doGet」をテスト
2. ログでエラーがないことを確認

## 🔧 トラブルシューティング

### よくある問題

#### 1. CORSエラー
- GASのスクリプトプロパティで`CORS_ORIGIN`が正しく設定されているか確認
- フロントエンドのURLが正確か確認

#### 2. API接続エラー
- GASのデプロイURLが正しいか確認
- フロントエンドの`REACT_APP_API_URL`が正しく設定されているか確認

#### 3. 認証エラー
- GASのスクリプトプロパティで`JWT_SECRET`が設定されているか確認
- データベース（Google Sheets）が正しく作成されているか確認

### ログの確認

#### GASログ
1. GASエディタで「実行」→「実行ログ」を確認
2. エラーメッセージを確認

#### GitHub Actionsログ
1. GitHubリポジトリのActionsタブでログを確認
2. デプロイの成功/失敗を確認

## 📝 注意事項

1. **GitHub Pagesの制限**
   - 環境変数が使えない
   - ビルド時にAPI URLを設定する必要がある

2. **GASの制限**
   - 実行時間制限（6分）
   - リクエスト数制限（1日あたり20,000回）

3. **Google Sheetsの制限**
   - 同時アクセス数制限
   - データサイズ制限

## 🎉 完了

これで完全無料でイベント管理システムが動作します！

- **フロントエンド**: GitHub Pages
- **バックエンド**: Google Apps Script
- **データベース**: Google Sheets
- **総コスト**: ¥0 