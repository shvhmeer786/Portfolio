import { NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/portfolio-assistant';

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); }
  catch { return NextResponse.json({ error: 'Please send a question.' }, { status: 400 }); }
  const question = (payload as { question?: unknown } | null)?.question;
  if (typeof question !== 'string' || !question.trim() || question.length > 600) {
    return NextResponse.json({ error: 'Please ask a question of up to 600 characters.' }, { status: 400 });
  }
  return NextResponse.json(answerQuestion(question));
}
