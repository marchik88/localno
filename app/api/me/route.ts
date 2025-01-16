import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
