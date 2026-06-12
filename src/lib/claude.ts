import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Brief Builder - Phỏng vấn người dùng để làm rõ yêu cầu
 */
export async function generateInterviewQuestions(
  type: string,
  rawInput: string,
  previousQAs?: { question: string; answer: string }[]
): Promise<string[]> {
  const typeLabel = {
    code: "viết code / xây dựng ứng dụng",
    content: "viết nội dung / content marketing",
    design: "thiết kế giao diện / UI/UX",
    business: "phân tích kinh doanh / chiến lược",
  }[type] || type;

  const conversationHistory = previousQAs?.length
    ? `\n\nCâu hỏi đã hỏi và câu trả lời:\n${previousQAs
        .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
        .join("\n\n")}`
    : "";

  const systemPrompt = `Bạn là chuyên gia phỏng vấn để làm rõ yêu cầu trong lĩnh vực: ${typeLabel}.

Nhiệm vụ: Đặt 3-5 câu hỏi thông minh để làm rõ yêu cầu của người dùng.

Nguyên tắc:
- Hỏi những gì người dùng có thể chưa nghĩ tới (edge cases, chi tiết thực tế)
- Không hỏi câu yes/no đơn thuần — hỏi câu mở để người dùng mô tả thêm
- Tập trung vào những quyết định quan trọng ảnh hưởng đến kết quả
- Mỗi câu hỏi kèm gợi ý (ví dụ) để người dùng dễ trả lời
- Giọng điệu thân thiện, như đồng nghiệp đang giúp đỡ
- Nếu đã có câu trả lời trước đó, hỏi sâu hơn, không lặp lại

Trả về JSON array gồm 3-5 câu hỏi. Không kèm markdown. Ví dụ:
["Câu hỏi 1", "Câu hỏi 2", "Câu hỏi 3"]`;

  const userPrompt = `Người dùng muốn: ${rawInput}${conversationHistory}

Hãy đặt 3-5 câu hỏi tiếp theo để làm rõ yêu cầu này.`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Parse JSON từ response
  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Fallback: extract từng dòng câu hỏi
    return text
      .split("\n")
      .map((l) => l.replace(/^\d+\.?\s*["\]]?\s*/, "").replace(/["\],]+$/g, ""))
      .filter((l) => l.length > 10);
  }
}

/**
 * Tạo brief hoàn chỉnh từ input + answers
 */
export async function generateFinalBrief(
  type: string,
  rawInput: string,
  qas: { question: string; answer: string }[]
): Promise<string> {
  const typeLabel = {
    code: "viết code / xây dựng ứng dụng",
    content: "viết nội dung / content marketing",
    design: "thiết kế giao diện / UI/UX",
    business: "phân tích kinh doanh / chiến lược",
  }[type] || type;

  const qaText = qas
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
    .join("\n\n");

  const systemPrompt = `Bạn là chuyên gia tạo specification cho ${typeLabel}.

Hãy tạo một bản brief HOÀN CHỈNH từ yêu cầu ban đầu và các câu trả lời phỏng vấn.

Bản brief phải bao gồm:
1. 📋 Tóm tắt dự án (2-3 câu)
2. 🎯 Mục tiêu & yêu cầu chính
3. 🔧 Chi tiết kỹ thuật / nội dung cụ thể
4. 🎨 Style & tone / UI guidelines (nếu liên quan)
5. ⚠️ Edge cases & lưu ý quan trọng
6. 📦 Deliverables cụ thể

Định dạng: Markdown sạch, dễ copy-paste cho AI tool khác. Dùng tiếng Việt.`;

  const userPrompt = `Yêu cầu ban đầu: ${rawInput}\n\nKết quả phỏng vấn:\n${qaText}\n\nTạo brief hoàn chỉnh.`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/**
 * Tạo tiêu đề ngắn cho brief
 */
export async function generateTitle(type: string, rawInput: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 50,
    system: "Tạo tiêu đề ngắn gọn (5-8 từ) bằng tiếng Việt cho bản brief. Chỉ trả về tiêu đề, không kèm gì khác.",
    messages: [{ role: "user", content: `Loại: ${type}. Yêu cầu: ${rawInput}` }],
  });

  return msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim()
    .replace(/^["']|["']$/g, "");
}
