# データ設計

## 1. ER図

```text
[Users] 1 -- 1 [LeaveBalances]
[Users] 1 -- * [DefaultWorkflowRoutes]
[Users] 1 -- * [Requests] (Applicant)
[Requests] 1 -- * [WorkflowSteps]
[Requests] 1 -- * [ActionHistories]
```

## 2. テーブル定義

### Users (モック用)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| Id | ユーザーID | String | PK |
| Name | 氏名 | String | Not Null |
| Role | ロール | String | Not Null |
| Email | メールアドレス | String | |

### Requests (休暇申請)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| Id | 申請ID | Guid | PK |
| ApplicantId | 申請者ID | String | FK(Users) |
| Type | 休暇種別 | String | Not Null |
| Status | ステータス | String | Not Null |
| StartDateTime | 開始日時 | DateTime | Not Null |
| EndDateTime | 終了日時 | DateTime | Not Null |
| UnitType | 単位 | String | Not Null (Hour, Day) |
| Reason | 理由 | String | |
| CreatedAt | 作成日時 | DateTime | Not Null |
| UpdatedAt | 更新日時 | DateTime | Not Null |

### WorkflowSteps (ワークフローステップ)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| Id | ステップID | Guid | PK |
| RequestId | 申請ID | Guid | FK(Requests) |
| StepOrder | 順序 | Int | Not Null |
| ApproverId | 承認者ID | String | FK(Users) |
| Status | ステータス | String | Not Null (Pending, Approved, Rejected) |

### ActionHistories (操作履歴)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| Id | 履歴ID | Guid | PK |
| RequestId | 申請ID | Guid | FK(Requests) |
| UserId | 操作者ID | String | FK(Users) |
| ActionType | 操作種別 | String | Not Null (Submit, Approve, Reject, Cancel) |
| Comment | コメント | String | |
| Timestamp | 操作日時 | DateTime | Not Null |

### LeaveBalances (休暇残数)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| UserId | ユーザーID | String | PK, FK(Users) |
| GrantedDays | 付与日数 | Decimal | Not Null |
| UsedDays | 使用日数 | Decimal | Not Null |
| CarryOverDays | 繰越日数 | Decimal | Not Null |

### DefaultWorkflowRoutes (デフォルト承認ルート)
| 物理名 | 論理名 | 型 | 制約 |
|---|---|---|---|
| Id | ルートID | Guid | PK |
| ApplicantId | 申請者ID | String | FK(Users) |
| StepOrder | 順序 | Int | Not Null |
| ApproverId | 承認者ID | String | FK(Users) |

## 3. インデックス戦略
- `Requests` テーブルの `ApplicantId`, `Status` にインデックスを付与し、検索パフォーマンスを向上。
- `WorkflowSteps` テーブルの `RequestId` および `ApproverId` にインデックスを付与。

## 4. 正規化方針
- 第3正規形までの正規化を実施。
- パフォーマンス上の懸念が生じた場合は、ダッシュボード集計用のサマリテーブル（非正規化）の導入を検討する。

## 5. トランザクション方針
- 承認操作時の `WorkflowSteps` 更新と、最終承認時の `Requests` ステータス更新、および `LeaveBalances` の残数計算更新は、必ず同一トランザクション内で実行し、データの一貫性を保証する。
