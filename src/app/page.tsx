import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg-animated opacity-10" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-5xl font-bold gradient-text">TKnown</span>
        </div>

        {/* Tagline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Đừng để AI <span className="gradient-text">đoán ý</span> bạn
        </h1>

        <p className="text-lg md:text-xl text-muted mb-4 max-w-xl mx-auto leading-relaxed">
          TKnown giúp bạn làm rõ mọi yêu cầu — từ code, content, design đến chiến lược kinh doanh
          — trước khi đưa cho AI thực thi.
        </p>

        <p className="text-sm text-muted/70 mb-10">
          Không còn prompt 5-7 lần. Không còn AI "hiểu sai ý". Chỉ cần trả lời vài câu hỏi thông minh.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/new"
            className="px-8 py-3.5 rounded-xl font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
          >
            🚀 Tạo Brief Ngay
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl font-semibold border border-card-border hover:bg-card/50 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              emoji: "💬",
              title: "1. Mô tả ý tưởng",
              desc: "Viết 1-2 câu về điều bạn muốn. Bằng ngôn ngữ tự nhiên của bạn.",
            },
            {
              emoji: "🎯",
              title: "2. AI phỏng vấn bạn",
              desc: "TKnown đặt câu hỏi thông minh để làm rõ — như 1 đồng nghiệp giúp bạn nghĩ kỹ hơn.",
            },
            {
              emoji: "📋",
              title: "3. Nhận Brief hoàn chỉnh",
              desc: "Bản spec rõ ràng, đầy đủ — copy-paste vào Cursor, ChatGPT hay bất kỳ AI tool nào.",
            },
          ].map((step) => (
            <div key={step.title} className="glass-card p-5 hover:border-primary/30 transition-colors">
              <div className="text-2xl mb-3">{step.emoji}</div>
              <h3 className="font-semibold mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="mt-16">
          <p className="text-sm text-muted/60 mb-4">Dùng cho mọi tác vụ AI</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["💻 Code App", "✍️ Viết Content", "🎨 Thiết Kế UI", "📊 Phân Tích KD", "📧 Soạn Email", "📝 Viết Docs"].map(
              (tag) => (
                <span key={tag} className="px-4 py-2 rounded-full text-sm bg-card border border-card-border text-muted">
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-20 text-xs text-muted/40">Built with ❤️ by Thanh · © 2026 TKnown</p>
      </div>
    </main>
  );
}
