# API仕様

## 1. 共通事項
- ベースURL: `/api`
- Content-Type: `application/json`
- 認証: 全てのエンドポイントで JWT Bearer 認証が必要 (`Authorization: Bearer <token>`)

## 2. エンドポイント一覧

### Auth
- `POST /api/auth/login`

### Requests (休暇申請)
- `GET /api/requests` : 申請一覧取得（自分の申請、または承認対象）
- `GET /api/requests/{id}` : 申請詳細取得
- `POST /api/requests` : 新規申請作成
- `POST /api/requests/{id}/approve` : 承認
- `POST /api/requests/{id}/reject` : 差戻し
- `POST /api/requests/{id}/cancel` : 取消

### LeaveBalances (休暇残数)
- `GET /api/leave-balances/me` : 自身の休暇残数取得

## 3. リクエスト・レスポンス例

### 3.1 POST /api/requests (新規申請)

**Request:**
```json
{
  "type": "Annual",
  "startDateTime": "2024-04-10T09:00:00Z",
  "endDateTime": "2024-04-10T17:45:00Z",
  "unitType": "Day",
  "reason": "私用のため"
}
```

**Response (201 Created):**
```json
{
  "id": "e2c34a...",
  "applicantId": "user1",
  "type": "Annual",
  "status": "Submitted",
  "startDateTime": "2024-04-10T09:00:00Z",
  "endDateTime": "2024-04-10T17:45:00Z",
  "unitType": "Day",
  "reason": "私用のため",
  "createdAt": "2024-04-01T10:00:00Z"
}
```

### 3.2 POST /api/requests/{id}/approve (承認)

**Request:**
```json
{
  "comment": "承認します"
}
```

**Response (200 OK):**
```json
{
  "id": "e2c34a...",
  "status": "InReview",
  "message": "Approved successfully"
}
```

## 4. ステータスコード
- 200 OK: 成功
- 201 Created: リソースの作成成功
- 400 Bad Request: リクエストボディのバリデーションエラー
- 401 Unauthorized: 認証エラー
- 403 Forbidden: 権限エラー
- 404 Not Found: リソースが存在しない
- 500 Internal Server Error: サーバー内部エラー
