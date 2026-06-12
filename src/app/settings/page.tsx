"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") { router.push("/login"); return null; }
  if (status === "loading") return null;

  return (
    <main className="min-h-screen flex">
      {/* Sidebar giống dashboard */}
      <aside className="w-64 border-r border-border bg-bg-raised hidden lg:flex flex-col p-6">
        <a href="/" className="text-2xl font-extrabold gradient-text-warm mb-10">TKnown</a>
        <nav className="flex flex-col gap-1 flex-1">
          <SidebarLink href="/dashboard" icon="📋" label="Brief của tôi" />
          <SidebarLink href="/settings" icon="⚙️" label="Cài đặt" active />
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

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-8">⚙️ Cài đặt</h1>

        <div className="max-w-xl space-y-6">
          {/* Profile card */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Thông tin tài khoản</h3>
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-14 h-14 rounded-full" />
              ) : (
                <div className="w-14 h-14 rounded-full gradient-bg-warm flex items-center justify-center text-white text-xl font-bold">
                  {session.user?.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-fg">{session.user?.name}</p>
                <p className="text-sm text-fg-muted">{session.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Theme placeholder */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-2">Giao diện</h3>
            <p className="text-sm text-fg-muted mb-3">Dark mode mặc định. Light mode sắp ra mắt.</p>
            <span className="tag">🌙 Dark</span>
          </div>

          {/* AI Model info */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-2">AI Model</h3>
            <p className="text-sm text-fg-muted mb-3">
              TKnown dùng DeepSeek để phỏng vấn và tạo brief. Hỗ trợ tiếng Việt tốt, chi phí thấp.
            </p>
            <span className="tag">🤖 DeepSeek V3</span>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-3 rounded-xl font-medium text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </main>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active ? "bg-white/5 text-fg" : "text-fg-muted hover:text-fg hover:bg-white/[0.03]"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </a>
  );
}
