'use client'

import { LoginButton } from '@telegram-auth/react';
import type { TelegramAuthData } from '@telegram-auth/react';

export default function HomePage() {
  const handleAuthCallback = async (data: TelegramAuthData) => {
    console.log('Telegram Auth Data:', data);

    const response = await fetch('/api/telegram-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
      <p className="mb-6">Sign in using Telegram</p>
      <LoginButton
        botUsername="marchugan_telegram_auth_bot"
        buttonSize="large"
        cornerRadius={5}
        showAvatar={true}
        lang="en"
        onAuthCallback={handleAuthCallback}
      />
    </main>
  );
}
