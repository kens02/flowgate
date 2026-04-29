# 詳細設計書

## 1. クラス設計 (Backend)

### Domain Layer
- `Request`: 休暇申請エンティティ。申請者ID、期間、理由などを保持。
- `WorkflowStep`: ワークフローの各ステップ。承認順序、承認者ID、ステータスを保持。
- `ActionHistory`: ユーザーの操作履歴。
- `LeaveBalance`: ユーザーの休暇残数。
- `User`: ユーザー情報（PoC用）。

### Application Layer (Services)
- `RequestService`: 申請作成、ステータス更新を担う。
- `WorkflowService`: 次の承認者の特定、決裁判定を担う。
- `LeaveCalculationService`: 休暇の消費分数計算、残数チェックを担う。

### Interfaces
- `IRequestRepository`
- `IWorkflowStepRepository`
- `ILeaveBalanceRepository`

## 2. モジュール設計 (Frontend)

- `app/(auth)/login`: ログイン画面
- `app/(dashboard)/page`: ダッシュボード（残数、サマリ）
- `app/(dashboard)/requests`: 申請一覧
- `app/(dashboard)/requests/new`: 新規申請画面
- `app/(dashboard)/requests/[id]`: 申請詳細・承認画面
- `components/ui`: 共通UIコンポーネント (Button, Input, Table 等)
- `lib/api`: APIクライアント関数群

## 3. インターフェース仕様 (DTO)

### RequestDto
```json
{
  "id": "uuid",
  "applicantId": "string",
  "type": "Annual",
  "status": "Submitted",
  "startDateTime": "2024-04-01T09:00:00Z",
  "endDateTime": "2024-04-01T17:45:00Z",
  "unitType": "Day",
  "reason": "私用のため",
  "currentStep": 1
}
```

## 4. 処理フロー

### 新規申請フロー
1. フロントエンドで申請フォーム入力。
2. API (`POST /api/requests`) 呼び出し。
3. バックエンドで `LeaveCalculationService` が残数チェック。
4. `RequestService` が `Request` と デフォルトの `WorkflowStep` レコードを生成。
5. `ActionHistory` に「申請」を記録。
6. (通知サービスをモックで呼び出し)。
7. DBに保存し、結果を返す。

### 承認フロー
1. API (`POST /api/requests/{id}/approve`) 呼び出し。
2. 対象の `WorkflowStep` を `Approved` に更新。
3. 次のステップが存在すれば、ステータスをそのまま(InReview)、または次の承認者へ通知。
4. 最終ステップであれば、`Request` 本体を `Approved` にし、`LeaveBalance` を減算処理。

## 5. 状態遷移 (Status)
- `Draft` → `Submitted` (申請時)
- `Submitted` → `InReview` (最初の承認者が承認した時)
- `InReview` → `Approved` (最終決裁者が承認した時)
- `{Any}` → `Rejected` (差戻し時)
- `Submitted/InReview` → `Cancelled` (取消時)

## 6. エラー設計
- 400 Bad Request: 入力バリデーションエラー、残数不足。
- 401 Unauthorized: JWTトークン未設定・有効期限切れ。
- 403 Forbidden: 承認権限のないリソースへのアクセス。
- 404 Not Found: 指定されたIDのデータが存在しない。
- 500 Internal Server Error: サーバー内部例外。

## 7. ログ仕様
- **アクセスログ**: 全APIリクエストに対するミドルウェアでの記録。
- **操作ログ**: `ActionHistory` テーブルへのビジネスロジック上の記録。
- **エラーログ**: 500エラー発生時のスタックトレース出力。

## 8. バリデーション仕様
- 終了日時は開始日時より後であること。
- 1日の場合、開始終了時間の差が業務時間と一致すること。
- 休暇理由は最大500文字。
