"use client";

import { useState, useEffect } from "react";

type RequestType = {
  id: string;
  type: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
  unitType: string;
  reason: string;
};

export default function Home() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  // フォームステート
  const [type, setType] = useState("Annual");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [unitType, setUnitType] = useState("Day");
  const [reason, setReason] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          startDateTime,
          endDateTime,
          unitType,
          reason,
        }),
      });
      if (res.ok) {
        setStartDateTime("");
        setEndDateTime("");
        setReason("");
        fetchRequests();
      } else {
        alert("申請に失敗しました");
      }
    } catch (e) {
      console.error(e);
      alert("申請エラー");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/requests/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">休暇申請ダッシュボード</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">新規申請</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">休暇種別</label>
              <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                <option value="Annual">年次有給休暇</option>
                <option value="Special">特別休暇</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">取得単位</label>
              <select value={unitType} onChange={e => setUnitType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                <option value="Day">1日</option>
                <option value="Hour">時間 (15分単位)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">開始日時</label>
              <input type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">終了日時</label>
              <input type="datetime-local" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">理由</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows={3}></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            申請する
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">申請一覧</h2>
        {loading ? (
          <p>読み込み中...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">申請はありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">種別</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">単位</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">開始</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">終了</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.type === 'Annual' ? '年次有給休暇' : '特別休暇'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.unitType === 'Day' ? '1日' : '時間'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.startDateTime).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.endDateTime).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${req.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' : 
                          req.status === 'InReview' ? 'bg-blue-100 text-blue-800' : 
                          req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {req.status !== 'Approved' && (
                        <button onClick={() => handleApprove(req.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          承認
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
