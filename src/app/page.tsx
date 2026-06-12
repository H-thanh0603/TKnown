import Link from "next/link";

const USE_CASES = [
  { emoji: "💻", title: "Code App", desc: "Mô tả ý tưởng → AI hỏi ngược → spec hoàn chỉnh cho Cursor" },
  { emoji: "✍️", title: "Viết Content", desc: "Từ email, blog đến social — AI giúp bạn viết đúng ý ngay lần đầu" },
  { emoji: "🎨", title: "Thiết Kế UI", desc: "Làm rõ phong cách, layout, mood trước khi vào Figma hay AI design" },
  { emoji: "📊", title: "Chiến Lược KD", desc: "AI chất vấn kế hoạch của bạn như 1 cố vấn, giúp bạn nhìn ra góc khuất" },
  { emoji: "📧", title: "Soạn Email", desc: "Không còn email lan man — AI hỏi đúng trọng tâm, bạn trả lời, email tự viết" },
  { emoji: "📝", title: "Viết Tài Liệu", desc: "Từ README, proposal đến hướng dẫn — mọi thứ rõ ràng từ câu hỏi đầu tiên" },
];

const STEPS = [
  { emoji: "💬", title: "Mô tả ý tưởng", desc: "1-2 câu bằng ngôn ngữ tự nhiên. Không cần prompt kỹ thuật." },
  { emoji: "🎯", title: "AI chất vấn bạn", desc: "TKnown đặt 3-5 câu hỏi thông minh như 1 đồng nghiệp giàu kinh nghiệm." },
  { emoji: "✨", title: "Nhận Brief hoàn chỉnh", desc: "Copy-paste cho Cursor, ChatGPT hay bất kỳ AI nào — code đúng ngay lần đầu." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Decorative blur orbs */}
        <div className="blur-orb blur-orb-indigo" style={{ top: "-10%", left: "-5%" }} />
        <div className="blur-orb blur-orb-pink" style={{ top: "40%", right: "-8%" }} />
        <div className="blur-orb blur-orb-amber" style={{ bottom: "10%", left: "20%" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse-glow" />
              AI Agent Era — Đừng để AI đoán ý bạn
            </span>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-in-delay-1 text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Bạn có ý tưởng.
            <br />
            <span className="gradient-text-warm">TKnown giúp bạn diễn đạt.</span>
          </h1>

          <p className="animate-fade-in-delay-2 text-lg md:text-xl text-fg-muted mb-4 max-w-2xl mx-auto leading-relaxed">
            Trước khi đưa cho AI code, viết, hay thiết kế — hãy để TKnown phỏng vấn bạn trước.
            Như một đồng nghiệp thông minh, TKnown hỏi đúng câu hỏi để bạn có bản brief hoàn chỉnh.
          </p>

          <p className="animate-fade-in-delay-2 text-sm text-fg-dim mb-10">
            Không còn prompt đi prompt lại. Không còn AI "hiểu sai". Chỉ cần trả lời vài câu hỏi.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/new" className="btn-primary text-lg px-10 py-4">
              🚀 Tạo Brief Đầu Tiên — Miễn Phí
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-10 py-4">
              Đăng nhập
            </Link>
          </div>

          {/* How it works */}
          <div className="animate-fade-in-delay-3 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {STEPS.map((step, i) => (
              <div key={i} className="glow-card p-6">
                <div className="text-3xl mb-4">{step.emoji}</div>
                <h3 className="font-semibold text-fg mb-2">{step.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ USE CASES SECTION ============ */}
      <section className="relative px-6 py-24">
        <div className="blur-orb blur-orb-indigo" style={{ top: "20%", right: "-10%", opacity: 0.08 }} />

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dùng cho <span className="gradient-text">mọi tác vụ AI</span>
            </h2>
            <p className="text-fg-muted text-lg max-w-xl mx-auto">
              Từ code, content, design đến chiến lược — TKnown giúp bạn có brief rõ ràng trước khi bắt tay vào làm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="glass-card p-6 group cursor-default">
                <div className="text-2xl mb-3">{uc.emoji}</div>
                <h3 className="font-semibold text-fg mb-1.5 group-hover:text-violet-400 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-sm text-fg-muted leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="blur-orb blur-orb-pink" style={{ width: 200, height: 200, top: -30, right: -30, opacity: 0.2 }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sẵn sàng để AI <span className="gradient-text-warm">hiểu bạn hơn</span>?
              </h2>
              <p className="text-fg-muted mb-8">Miễn phí. Không cần thẻ tín dụng. Chỉ cần 1 ý tưởng.</p>
              <Link href="/new" className="btn-primary text-lg px-12 py-4">
                ✨ Bắt Đầu Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10">
        <div className="divider mb-8" />
        <p className="text-xs text-fg-dim">
          Built with ❤️ in Vietnam · © 2026 TKnown
        </p>
      </footer>
    </main>
  );
}
