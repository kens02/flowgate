import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowgate (承認決裁システム PoC)",
  description: "休暇申請PoCアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
          <div className="w-full max-w-4xl px-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
