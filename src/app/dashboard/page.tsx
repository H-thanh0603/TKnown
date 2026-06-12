import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg-raised hidden lg:flex flex-col p-6">
        <Link href="/" className="text-2xl font-extrabold gradient-text-warm mb-10">
          TKnown
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          <NavItem active icon="📋" label="Brief của tôi" />
          <NavItem icon="⭐" label="Đã lưu" />
          <NavItem icon="⚙️" label="Cài đặt" />
        </nav>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {session.user?.image ? (
            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
              {session.user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-fg truncate">{session.user?.name}</p>
            <p className="text-xs text-fg-dim truncate">{session.user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <Link href="/" className="text-xl font-extrabold gradient-text-warm">
            TKnown
          </Link>
          {session.user?.image && (
            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
          )}
        </div>

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">
            Xin chào, {session.user?.name?.split(" ")[0] || "bạn"} 👋
          </h1>
          <p className="text-fg-muted">Sẵn sàng tạo brief mới?</p>
        </div>

        {/* Quick action */}
        <Link
          href="/new"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold gradient-bg text-white hover:opacity-90 transition-all shadow-glow mb-12"
        >
          <span className="text-lg">+</span>
          Tạo Brief Mới
        </Link>

        {/* Empty state */}
        <div className="glass-card p-16 text-center max-w-2xl">
          <div className="text-6xl mb-6">✨</div>
          <h3 className="text-xl font-semibold mb-3">Chưa có brief nào</h3>
          <p className="text-fg-muted mb-8 max-w-md mx-auto leading-relaxed">
            Bắt đầu tạo brief đầu tiên. AI sẽ phỏng vấn bạn để hiểu rõ yêu cầu,
            rồi tạo ra bản spec hoàn chỉnh bạn có thể copy-paste vào bất kỳ AI tool nào.
          </p>
          <Link href="/new" className="btn-primary">
            🚀 Tạo Brief Đầu Tiên
          </Link>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-white/5 text-fg"
          : "text-fg-muted hover:text-fg hover:bg-white/[0.03]"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}
