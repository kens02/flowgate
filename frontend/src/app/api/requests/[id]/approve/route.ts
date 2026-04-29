import { NextResponse } from 'next/server';
import { getRequests, updateRequestStatus } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const requests = getRequests();
  const req = requests.find(r => r.id === id);
  
  if (!req) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 簡単な承認ステータスの遷移モック (Submitted -> InReview -> Approved)
  if (req.status === "Submitted") {
    updateRequestStatus(id, "InReview");
  } else if (req.status === "InReview") {
    updateRequestStatus(id, "Approved");
  }

  return NextResponse.json({ message: "Approved successfully", newStatus: req.status });
}
