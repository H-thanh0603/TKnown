import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateInterviewQuestions,
  generateFinalBrief,
  generateTitle,
} from "@/lib/claude";

// POST /api/brief — tạo brief mới, trả về câu hỏi phỏng vấn đầu tiên
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, rawInput } = await req.json();
  if (!type || !rawInput) {
    return NextResponse.json({ error: "Thiếu type hoặc rawInput" }, { status: 400 });
  }

  // Tạo brief trong DB
  const brief = await prisma.brief.create({
    data: {
      userId: session.user.id,
      type,
      rawInput,
      title: "",
      status: "interviewing",
    },
  });

  // Sinh câu hỏi phỏng vấn đầu tiên
  const questions = await generateInterviewQuestions(type, rawInput);

  // Lưu câu hỏi vào DB
  await prisma.brief.update({
    where: { id: brief.id },
    data: { questions: JSON.stringify(questions) },
  });

  return NextResponse.json({
    id: brief.id,
    questions,
    status: "interviewing",
  });
}

// PUT /api/brief — trả lời câu hỏi, nhận câu hỏi tiếp theo hoặc final brief
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { briefId, answers } = await req.json();
  if (!briefId || !answers) {
    return NextResponse.json({ error: "Thiếu briefId hoặc answers" }, { status: 400 });
  }

  const brief = await prisma.brief.findUnique({ where: { id: briefId } });
  if (!brief || brief.userId !== session.user.id) {
    return NextResponse.json({ error: "Không tìm thấy brief" }, { status: 404 });
  }

  // Lấy Q&A cũ
  const oldQuestions: string[] = JSON.parse(brief.questions);
  const oldAnswers: string[] = JSON.parse(brief.answers);

  // Thêm câu trả lời mới (answers là array các câu trả lời tương ứng)
  const newAnswers = [...oldAnswers, ...answers];

  // Nếu đã trả lời >= 6 câu hoặc 2 vòng, tạo final brief
  const shouldComplete = newAnswers.length >= 6;

  if (shouldComplete) {
    // Tạo final brief
    const qas = oldQuestions.slice(0, newAnswers.length).map((q, i) => ({
      question: q,
      answer: newAnswers[i] || "",
    }));

    const [finalBrief, title] = await Promise.all([
      generateFinalBrief(brief.type, brief.rawInput, qas),
      generateTitle(brief.type, brief.rawInput),
    ]);

    await prisma.brief.update({
      where: { id: briefId },
      data: {
        answers: JSON.stringify(newAnswers),
        finalBrief,
        title,
        status: "completed",
      },
    });

    return NextResponse.json({
      status: "completed",
      brief: finalBrief,
      title,
    });
  }

  // Tạo câu hỏi tiếp theo
  const qas = oldQuestions.slice(0, newAnswers.length).map((q, i) => ({
    question: q,
    answer: newAnswers[i] || "",
  }));

  const newQuestions = await generateInterviewQuestions(
    brief.type,
    brief.rawInput,
    qas
  );

  // Cập nhật DB
  const allQuestions = [...oldQuestions, ...newQuestions];
  await prisma.brief.update({
    where: { id: briefId },
    data: {
      answers: JSON.stringify(newAnswers),
      questions: JSON.stringify(allQuestions),
    },
  });

  return NextResponse.json({
    status: "interviewing",
    questions: newQuestions,
    round: Math.floor(newAnswers.length / 3) + 1,
  });
}
