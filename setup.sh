#!/bin/bash

echo "🚀 イベント管理システムのセットアップを開始します..."

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# バックエンドの依存関係をインストール
echo "🔧 バックエンドの依存関係をインストール中..."
cd backend && npm install && cd ..

# フロントエンドの依存関係をインストール
echo "🎨 フロントエンドの依存関係をインストール中..."
cd frontend && npm install && cd ..

echo "✅ セットアップが完了しました！"
echo ""
echo "🎯 次のコマンドでアプリケーションを起動できます："
echo "   npm run dev"
echo ""
echo "📖 アプリケーションにアクセス："
echo "   フロントエンド: http://localhost:3000"
echo "   バックエンドAPI: http://localhost:5001/api"
echo ""
echo "🎊 イベント管理システムをお楽しみください！" 