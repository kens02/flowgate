# アーキテクチャ設計書

## 1. 全体アーキテクチャ概要

本システム(flowgate)は、フロントエンドにNext.js、バックエンドにASP.NET Core Web APIを採用したSPA (Single Page Application) + REST API アーキテクチャで構成される。

## 2. コンポーネント構成

### 2.1 フロントエンド (Next.js)
- **App Router**: ルーティングおよびページレンダリング (SSR/CSR/SSG を適材適所で利用)。
- **UI Components**: React (shadcn/ui + Tailwind CSS) によるプレゼンテーション層。
- **State Management**: React Context API または Zustand を用いたグローバル状態管理。
- **Data Fetching**: SWR または React Query を用いたAPI通信・キャッシュ管理。

### 2.2 バックエンド (ASP.NET Core)
Clean Architecture（クリーンアーキテクチャ）を採用し、以下の層に分割する。
- **Domain Layer (Core)**: 
  - エンティティ（Request, WorkflowStep など）
  - ドメインルール（休暇日数の計算ルール、ステータス遷移ルール）
  - リポジトリインターフェース
- **Application Layer**:
  - ユースケース（申請処理、承認処理、差戻し処理など）
  - DTOs (Data Transfer Objects)
- **Infrastructure Layer**:
  - EF Core によるデータアクセス実装
  - 外部サービス連携（メール通知等）のモック実装
- **Presentation Layer (Web API)**:
  - コントローラー
  - ルーティング、認証・認可フィルター
  - 例外ハンドリング（Middleware）

### 2.3 データベース
- **RDBMS**: Entity Framework Core を介してアクセス。PoCフェーズでは InMemory Database または SQLite/MySQL を利用し、容易に切り替え可能な構造とする。

## 3. インフラ・デプロイ構成 (想定)

- **Frontend**: Vercel または Dockerコンテナとしてのホスティング。
- **Backend**: Azure App Service, AWS ECS, または Dockerコンテナ。
- **Database**: Azure SQL, Amazon RDS, またはローカルDB。

## 4. 技術選定理由
- **Next.js**: 開発体験の良さ、豊富なエコシステム、App Routerによる高いパフォーマンス。
- **ASP.NET Core**: 堅牢な型システム（C#）、高パフォーマンス、依存性の注入（DI）の標準サポート、クリーンアーキテクチャとの親和性。
- **Clean Architecture**: ビジネスロジックとインフラの分離、高いテスト容易性、将来の要件変更（例：他申請への拡張）に対する柔軟性の確保。
