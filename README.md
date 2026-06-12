# TKnown — AI Brief Builder

> **Đừng để AI đoán ý bạn.** TKnown giúp bạn làm rõ mọi yêu cầu trước khi đưa cho AI thực thi.

## 🎯 Vấn đề

Khi dùng AI (Cursor, ChatGPT, Claude...) để code/viết/thiết kế, bạn thường phải prompt đi prompt lại 5-7 lần vì AI không hiểu đúng ý. TKnown giải quyết vấn đề này bằng cách **phỏng vấn ngược** — AI sẽ hỏi bạn những câu hỏi thông minh để làm rõ yêu cầu, sau đó tạo ra một bản brief hoàn chỉnh.

## ✨ Flow

1. **💬 Mô tả ý tưởng** — Viết 1-2 câu bằng ngôn ngữ tự nhiên
2. **🎯 AI phỏng vấn bạn** — TKnown hỏi 3-5 câu thông minh để làm rõ edge cases, yêu cầu thực tế
3. **📋 Nhận Brief hoàn chỉnh** — Copy-paste vào Cursor/ChatGPT/Claude và code ngay

## 🛠 Tech Stack

- **Frontend:** Next.js 16 + Tailwind CSS + Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** Prisma 5 + SQLite
- **Auth:** NextAuth.js (Google OAuth)
- **AI:** Claude API (Anthropic)
- **Deploy:** Vercel

## 🚀 Chạy local

```bash
git clone https://github.com/H-thanh0603/TKnown.git
cd TKnown
npm install

# Tạo file .env với:
# DATABASE_URL="file:./dev.db"
# ANTHROPIC_API_KEY=sk-ant-...
# NEXTAUTH_SECRET=your-secret
# NEXTAUTH_URL=http://localhost:3000
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

npx prisma generate
npx prisma db push
npm run dev
```

## 📦 MVP Scope (v1)

- [x] Landing page
- [x] Google Login
- [x] Dashboard
- [x] Flow tạo brief (code/content/design/business)
- [x] AI phỏng vấn 2 vòng
- [x] Brief hoàn chỉnh (copy-paste được)
- [ ] Lịch sử brief
- [ ] Chia sẻ brief
- [ ] Premium plans
- [ ] Export PDF/Notion

---

Built with ❤️ by [Thanh](https://github.com/H-thanh0603)
