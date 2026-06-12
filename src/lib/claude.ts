/**
 * AI Client — hỗ trợ DeepSeek (default) và Claude
 * DeepSeek: OpenAI-compatible, rẻ, giỏi tiếng Việt
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// Dùng DeepSeek nếu có key, ngược lại fallback sang Claude
const USE_DEEPSEEK = !!DEEPSEEK_API_KEY;

interface ChatParams {
  system: string;
  user: string;
  maxTokens?: number;
  jsonMode?: boolean;
}

async function callDeepSeek(params: ChatParams): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
      max_tokens: params.maxTokens || 2048,
      temperature: 0.7,
      ...(params.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callClaude(params: ChatParams): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: params.maxTokens || 2048,
    system: params.system,
    messages: [{ role: "user", content: params.user }],
  });

  return msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

async function chat(params: ChatParams): Promise<string> {
  if (USE_DEEPSEEK) {
    try {
      return await callDeepSeek(params);
    } catch (e) {
      console.error("DeepSeek failed, falling back to Claude:", e);
      if (ANTHROPIC_API_KEY) return callClaude(params);
      throw e;
    }
  }
  if (ANTHROPIC_API_KEY) return callClaude(params);
  throw new Error("Không có AI API key nào được cấu hình. Thêm DEEPSEEK_API_KEY hoặc ANTHROPIC_API_KEY vào .env");
}

/**
 * Brief Builder — Phỏng vấn người dùng
 */
export async function generateInterviewQuestions(
  type: string,
  rawInput: string,
  previousQAs?: { question: string; answer: string }[]
): Promise<string[]> {
  const typeLabel =
    {
      code: "viết code / xây dựng ứng dụng",
      content: "viết nội dung / content marketing",
      design: "thiết kế giao diện / UI/UX",
      business: "phân tích kinh doanh / chiến lược",
    }[type] || type;

  const history = previousQAs?.length
    ? `\n\nCâu hỏi trước và câu trả lời:\n${previousQAs
        .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
        .join("\n\n")}`
    : "";

  const system = `Bạn là chuyên gia phỏng vấn để làm rõ yêu cầu trong lĩnh vực: ${typeLabel}.

Nhiệm vụ: Đặt 3-5 câu hỏi thông minh (bằng tiếng Việt) để làm rõ yêu cầu.

Nguyên tắc:
- Hỏi những gì người dùng có thể chưa nghĩ tới (edge cases, chi tiết)
- Không hỏi yes/no — hỏi câu mở, kèm gợi ý
- Tập trung vào quyết định quan trọng ảnh hưởng kết quả
- Nếu đã có câu trả lời trước, hỏi sâu hơn, không lặp
- Giọng thân thiện, như đồng nghiệp

Trả về CHỈ JSON array, không markdown. Format: ["câu 1", "câu 2", "câu 3"]`;

  const text = await chat({
    system,
    user: `Người dùng muốn: ${rawInput}${history}\n\nĐặt 3-5 câu hỏi. Chỉ trả về JSON array.`,
    maxTokens: 1024,
    jsonMode: true,
  });

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return text
      .split("\n")
      .map((l) => l.replace(/^\d+\.?\s*["\]]?\s*/, "").replace(/["\],]+$/g, ""))
      .filter((l) => l.length > 10);
  }
}

/**
 * Tạo brief hoàn chỉnh
 */
export async function generateFinalBrief(
  type: string,
  rawInput: string,
  qas: { question: string; answer: string }[]
): Promise<string> {
  const typeLabel =
    {
      code: "viết code / xây dựng ứng dụng",
      content: "viết nội dung / content marketing",
      design: "thiết kế giao diện / UI/UX",
      business: "phân tích kinh doanh / chiến lược",
    }[type] || type;

  const qaText = qas
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
    .join("\n\n");

  const system = `Bạn là chuyên gia tạo specification cho ${typeLabel}.

Tạo bản brief HOÀN CHỈNH bằng tiếng Việt, gồm:
1. 📋 Tóm tắt dự án (2-3 câu)
2. 🎯 Mục tiêu & yêu cầu chính
3. 🔧 Chi tiết kỹ thuật / nội dung cụ thể
4. 🎨 Style & tone / UI guidelines (nếu liên quan)
5. ⚠️ Edge cases & lưu ý quan trọng
6. 📦 Deliverables cụ thể

Markdown sạch, dễ copy-paste.`;

  return chat({
    system,
    user: `Yêu cầu: ${rawInput}\n\nKết quả phỏng vấn:\n${qaText}\n\nTạo brief hoàn chỉnh.`,
    maxTokens: 4096,
  });
}

/**
 * Tạo tiêu đề ngắn
 */
export async function generateTitle(type: string, rawInput: string): Promise<string> {
  const text = await chat({
    system: "Tạo tiêu đề ngắn gọn (5-8 từ) bằng tiếng Việt cho bản brief. Chỉ trả về tiêu đề.",
    user: `Loại: ${type}. Yêu cầu: ${rawInput}`,
    maxTokens: 50,
  });
  return text.trim().replace(/^["']|["']$/g, "");
}
