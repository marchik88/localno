import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { signToken } from '@/utils/jwt';

function validateTelegramAuth(data: Record<string, string>, botToken: string) {
  const { hash, ...authData } = data;

  const checkString = Object.keys(authData).sort().
    map((key) => `${key}=${authData[key]}`).join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(checkString).
    digest('hex');

  return hmac === hash;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json({
      success: false,
      error: 'Telegram bot token is not configured'
    }, { status: 500 });
  }

  if (!validateTelegramAuth(body, botToken)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid Telegram data'
    }, { status: 400 });
  }

  const { id, first_name, last_name, photo_url } = body;

  const token = signToken({ id, first_name, last_name, photo_url });

  const response = NextResponse.json({ success: true, token });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}
