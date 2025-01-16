import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

export default async function middleware(request: Request) {
  const cookieStore = await cookies(); // Await the cookies object
  const token = cookieStore.get('auth_token')?.value;

  // Redirect to login if no token exists
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the token
  const user = verifyToken(token);

  // Redirect to login if token is invalid
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'], // Protect specified routes
};
