import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession } from '@/lib/auth';

export async function POST() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('asmedix_session')?.value;
  if (sessionId) {
    destroySession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('asmedix_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    sameSite: 'lax',
  });
  response.cookies.set('asmedix_demo_override', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    sameSite: 'lax',
  });
  return response;
}
