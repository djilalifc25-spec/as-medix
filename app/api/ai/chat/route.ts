import { NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { messages, action, payload } = await req.json();

    if (action === 'generate_qcm') {
      const qcm = await aiProvider.generateQcm(payload?.topic, payload?.specialty);
      return NextResponse.json({ success: true, qcm });
    }

    if (action === 'generate_case') {
      const clinicalCase = await aiProvider.generateClinicalCase(payload?.specialty, payload?.difficulty);
      return NextResponse.json({ success: true, clinicalCase });
    }

    if (action === 'summarize') {
      const summary = await aiProvider.summarizeCourse(payload?.content);
      return NextResponse.json({ success: true, summary });
    }

    // Default chat
    const response = await aiProvider.chat(messages || []);
    return NextResponse.json({ success: true, reply: response });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur IA' }, { status: 500 });
  }
}
