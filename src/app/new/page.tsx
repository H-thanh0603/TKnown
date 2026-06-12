"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const TYPES = [
  { id: "code", emoji: "💻", label: "Code App", desc: "Web, app, tính năng mới" },
  { id: "content", emoji: "✍️", label: "Viết Content", desc: "Blog, email, social" },
  { id: "design", emoji: "🎨", label: "Thiết Kế UI", desc: "Giao diện, landing page" },
  { id: "business", emoji: "📊", label: "Chiến Lược KD", desc: "Phân tích, kế hoạch" },
];

type Step = "input" | "interview" | "complete";

export default function NewBriefPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>("input");
  const [type, setType] = useState("code");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [briefId, setBriefId] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [round, setRound] = useState(1);

  const [finalBrief, setFinalBrief] = useState("");
  const [briefTitle, setBriefTitle] = useState("");

  if (status === "unauthenticated") { router.push("/login"); return null; }
  if (status === "loading") return null;

  // Step 1 → Start interview
  async function handleStart() {
    if (!rawInput.trim()) { toast.error("Vui lòng mô tả ý tưởng"); return; }
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
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  // Step 2 → Submit answers
  async function handleSubmitAnswers() {
    const current = questions.map((_, i) => answers[i] || "");
    if (current.some((a) => !a.trim())) { toast.error("Trả lời tất cả câu hỏi nhé"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/brief", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId, answers: current }),
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
        toast.success(`Vòng ${data.round} — thêm ${data.questions.length} câu hỏi`);
      }
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  function handleCopy() {
    navigator.clipboard.writeText(finalBrief);
    toast.success("Đã copy brief!");
  }

  function reset() {
    setStep("input"); setRawInput(""); setFinalBrief(""); setBriefTitle("");
  }

  // Step indicator
  const steps = ["Ý tưởng", "Phỏng vấn", "Hoàn thành"];
  const currentStepIdx = step === "input" ? 0 : step === "interview" ? 1 : 2;

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${i <= currentStepIdx ? "text-fg" : "text-fg-dim"}`}>
                <div className={`step-dot ${i < currentStepIdx ? "done" : ""} ${i === currentStepIdx ? "active" : ""}`} />
                <span className="text-sm font-medium">{s}</span>
              </div>
              {i < 2 && <div className={`w-8 h-px ${i < currentStepIdx ? "bg-accent-2" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Input */}
        {step === "input" && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Bạn muốn làm gì?</h2>
              <p className="text-fg-muted">Chọn lĩnh vực và mô tả ý tưởng — đơn giản thôi</p>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    type === t.id
                      ? "border-violet-500/40 bg-violet-500/5 shadow-glow"
                      : "border-border hover:border-border-hover"
                  }`}
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <div className="font-semibold text-fg mb-0.5">{t.label}</div>
                  <div className="text-xs text-fg-muted">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Input */}
            <div>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder='Ví dụ: "Tôi muốn thêm đăng nhập Google cho web bán hàng bằng Next.js..."'
                rows={4}
                className="input-warm resize-none"
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleStart(); }}
              />
              <p className="text-xs text-fg-dim mt-2">Ctrl+Enter để bắt đầu nhanh</p>
            </div>

            <button onClick={handleStart} disabled={loading || !rawInput.trim()} className="btn-primary w-full py-3.5 text-base">
              {loading ? "⏳ Đang chuẩn bị câu hỏi..." : "🎯 Bắt Đầu Phỏng Vấn"}
            </button>
          </div>
        )}

        {/* STEP 2: Interview */}
        {step === "interview" && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-1">Vòng {round}/2</h2>
              <p className="text-fg-muted">Trả lời các câu hỏi để AI hiểu rõ yêu cầu của bạn</p>
            </div>

            {questions.map((q, i) => (
              <div key={i} className="glow-card p-6">
                <label className="flex items-start gap-3">
                  <span className="text-violet-400 font-bold text-lg mt-0.5 shrink-0">Q{i + 1}.</span>
                  <span className="font-medium text-fg leading-relaxed">{q}</span>
                </label>
                <textarea
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  placeholder="Nhập câu trả lời..."
                  rows={3}
                  className="input-warm mt-4 resize-none"
                />
              </div>
            ))}

            <button onClick={handleSubmitAnswers} disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? "⏳ Đang xử lý..." : round === 1 ? "📤 Gửi & Tiếp Tục" : "✨ Tạo Brief Hoàn Chỉnh"}
            </button>
          </div>
        )}

        {/* STEP 3: Complete */}
        {step === "complete" && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-2">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-1">{briefTitle || "Brief hoàn thành!"}</h2>
              <p className="text-fg-muted">Copy brief này và paste vào Cursor, ChatGPT, Claude...</p>
            </div>

            <div className="glass-card p-6 overflow-x-auto">
              <pre className="text-sm text-fg-muted whitespace-pre-wrap font-sans leading-relaxed">{finalBrief}</pre>
            </div>

            <div className="flex gap-3">
              <button onClick={handleCopy} className="flex-1 py-3 rounded-xl font-semibold bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/20 transition-all">
                📋 Copy Brief
              </button>
              <button onClick={() => router.push("/dashboard")} className="btn-secondary flex-1 py-3">
                ← Dashboard
              </button>
            </div>

            <button onClick={reset} className="btn-primary w-full py-3.5 text-base">
              ✨ Tạo Brief Mới
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
