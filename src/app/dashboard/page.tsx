import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">
            TKnown
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/new"
              className="px-5 py-2 rounded-lg text-sm font-medium gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              + Tạo Brief Mới
            </Link>
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-card-border"
              />
            )}
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">
            Xin chào, {session.user?.name?.split(" ")[0] || "bạn"} 👋
          </h1>
          <p className="text-muted">Brief của bạn — sẵn sàng để dùng hoặc cải thiện thêm.</p>
        </div>

        {/* Empty state */}
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">Chưa có brief nào</h3>
          <p className="text-muted mb-6 max-w-sm mx-auto">
            Bắt đầu tạo brief đầu tiên — AI sẽ phỏng vấn bạn để làm rõ mọi yêu cầu.
          </p>
          <Link
            href="/new"
            className="inline-block px-6 py-3 rounded-xl font-medium gradient-bg text-white hover:opacity-90 transition-opacity"
          >
            🚀 Tạo Brief Đầu Tiên
          </Link>
        </div>
      </div>
    </main>
  );
}
