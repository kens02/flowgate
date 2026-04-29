# 承認決裁システム (flowgate) PoC

本プロジェクトは、休暇申請および承認ワークフローを電子化するためのPoC（概念実証）アプリケーションです。

## 技術スタック
- フロントエンド: Next.js (App Router), React, Tailwind CSS
- バックエンド: ASP.NET Core Web API / Next.js API Routes (PoC用モック)
- データベース: In-Memory (PoC用)

## ディレクトリ構成
- `docs/`: 要件定義・設計書一式
- `frontend/`: Next.js アプリケーション
- `backend/`: ASP.NET Core Web API プロジェクト
- `tests/`: フロントエンド・バックエンドのテスト

## セットアップ手順

### 前提条件
- Node.js (v18+)
- .NET 8.0 SDK

### フロントエンドの起動
今回はPoCの実行確認のため、Next.jsのAPI Routesを使ってバックエンドモックも同時に起動します。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### バックエンドの起動 (C#)
フル機能版のAPIとして動かす場合（開発中）
```bash
cd backend
dotnet run
```

## テストの実行

### フロントエンド (Jest)
```bash
cd frontend
npm test
```

## 成果物 (ドキュメント)
`docs/` フォルダ配下に以下のドキュメントを格納しています。
- `requirements.md`: 要件定義書
- `assumptions.md`: 補完仕様・前提条件
- `architecture.md`: アーキテクチャ設計書
- `basic-design.md`: 基本設計書
- `detail-design.md`: 詳細設計書
- `data-model.md`: データ設計
- `api-spec.md`: API仕様
- `test-spec.md`: テスト仕様書
