"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const TYPES = [
  { id: "code", label: "💻 Code App", desc: "Xây dựng web, app, tính năng mới" },
  { id: "content", label: "✍️ Viết Content", desc: "Bài blog, email, social media" },
  { id: "design", label: "🎨 Thiết Kế UI", desc: "Giao diện, landing page, component" },
  { id: "business", label: "📊 Phân Tích KD", desc: "Chiến lược, phân tích thị trường" },
];

type Step = "input" | "interview" | "complete";

export default function NewBriefPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<Step>("input");
  const [type, setType] = useState("code");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Interview state
  const [briefId, setBriefId] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [round, setRound] = useState(1);

  // Result state
  const [finalBrief, setFinalBrief] = useState("");
  const [briefTitle, setBriefTitle] = useState("");

  // Auth guard
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  if (status === "loading") return null;

  // ============ STEP 1: Nhập thông tin ============
  async function handleStartInterview() {
    if (!rawInput.trim()) {
      toast.error("Vui lòng mô tả ý tưởng của bạn");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, rawInput: rawInput.trim() }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setBriefId(data.id);
      setQuestions(data.questions);
      setAnswers({});
      setRound(1);
      setStep("interview");
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  // ============ STEP 2: Trả lời câu hỏi ============
  async function handleSubmitAnswers() {
    const currentAnswers = questions.map((_, i) => answers[i] || "");

    if (currentAnswers.some((a) => !a.trim())) {
      toast.error("Vui lòng trả lời tất cả câu hỏi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/brief", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId, answers: currentAnswers }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      if (data.status === "completed") {
        setFinalBrief(data.brief);
        setBriefTitle(data.title);
        setStep("complete");
      } else {
        setQuestions(data.questions);
        setAnswers({});
        setRound(data.round);
        toast.success(`Vòng ${data.round} — ${data.questions.length} câu hỏi mới`);
      }
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  // ============ STEP 3: Copy brief ============
  function handleCopyBrief() {
    navigator.clipboard.writeText(finalBrief);
    toast.success("Đã copy brief vào clipboard!");
  }

  // ============ UI ============
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {step === "input" && "Tạo Brief Mới"}
            {step === "interview" && `Phỏng vấn — Vòng ${round}`}
            {step === "complete" && "✅ Brief Hoàn Thành"}
          </h1>
          <p className="text-muted">
            {step === "input" && "Mô tả ý tưởng của bạn, AI sẽ giúp làm rõ"}
            {step === "interview" && "Trả lời các câu hỏi bên dưới để AI hiểu rõ hơn"}
            {step === "complete" && briefTitle}
          </p>
        </div>

        {/* STEP 1: Input */}
        {step === "input" && (
          <div className="space-y-6">
            {/* Type selector */}
            <div>
              <label className="text-sm font-medium text-muted mb-3 block">Bạn muốn làm gì?</label>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      type === t.id
                        ? "border-primary bg-primary/10 shadow-lg shadow-indigo-500/10"
                        : "border-card-border hover:border-primary/30"
                    }`}
                  >
                    <div className="font-medium mb-1">{t.label}</div>
                    <div className="text-xs text-muted">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Raw input */}
            <div>
              <label className="text-sm font-medium text-muted mb-3 block">
                Mô tả ý tưởng của bạn (1-3 câu)
              </label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder='Ví dụ: "Tôi muốn thêm chức năng đăng nhập cho web bán hàng..."'
                rows={4}
                className="w-full p-4 rounded-xl bg-card border border-card-border focus:border-primary focus:outline-none resize-none text-sm placeholder:text-muted/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleStartInterview();
                  }
                }}
              />
              <p className="text-xs text-muted/50 mt-2">Ctrl+Enter để bắt đầu</p>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading || !rawInput.trim()}
              className="w-full py-3.5 rounded-xl font-semibold gradient-bg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
            >
              {loading ? "⏳ Đang chuẩn bị câu hỏi..." : "🎯 Bắt Đầu Phỏng Vấn"}
            </button>
          </div>
        )}

        {/* STEP 2: Interview */}
        {step === "interview" && (
          <div className="space-y-6">
            {/* Questions */}
            {questions.map((q, i) => (
              <div key={i} className="glass-card p-5">
                <label className="font-medium mb-3 block">
                  <span className="text-primary mr-2">Q{i + 1}.</span>
                  {q}
                </label>
                <textarea
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  placeholder="Nhập câu trả lời của bạn..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-black/20 border border-card-border focus:border-primary focus:outline-none resize-none text-sm placeholder:text-muted/50"
                />
              </div>
            ))}

            <button
              onClick={handleSubmitAnswers}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold gradient-bg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? "⏳ Đang xử lý..." : "📤 Gửi Câu Trả Lời"}
            </button>

            <p className="text-xs text-muted/50 text-center">
              Vòng {round} · Sau 2 vòng AI sẽ tạo brief hoàn chỉnh
            </p>
          </div>
        )}

        {/* STEP 3: Complete */}
        {step === "complete" && (
          <div className="space-y-6">
            {/* Brief output */}
            <div className="glass-card p-6 overflow-x-auto">
              <div
                className="prose prose-invert prose-sm max-w-none [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base"
                dangerouslySetInnerHTML={{ __html: finalBrief.replace(/\n/g, "<br/>") }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyBrief}
                className="flex-1 py-3 rounded-xl font-semibold bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
              >
                📋 Copy Brief
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-3 rounded-xl font-semibold border border-card-border hover:bg-card/50 transition-colors"
              >
                ← Về Dashboard
              </button>
            </div>

            <button
              onClick={() => {
                setStep("input");
                setRawInput("");
                setFinalBrief("");
                setBriefTitle("");
              }}
              className="w-full py-3 rounded-xl font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              ✨ Tạo Brief Mới
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
