import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    stats: {
      piegesCount: 0,
      dueTodayCount: 0,
    },
    reminders: [],
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true });
}
