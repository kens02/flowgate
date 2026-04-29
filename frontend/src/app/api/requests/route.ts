import { NextResponse } from 'next/server';

// 簡易的なインメモリDB
let requests = [
  {
    id: "1",
    applicantId: "user1",
    type: "Annual",
    status: "Submitted",
    startDateTime: "2024-05-01T09:00:00",
    endDateTime: "2024-05-01T17:45:00",
    unitType: "Day",
    reason: "私用のため",
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRequest = {
      id: Math.random().toString(36).substring(7),
      applicantId: "user1",
      status: "Submitted",
      createdAt: new Date().toISOString(),
      ...body
    };
    requests.push(newRequest);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// 他のモジュールからデータにアクセスするためのヘルパーエクスポート
export const getRequests = () => requests;
export const updateRequestStatus = (id: string, status: string) => {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = status;
  }
};
