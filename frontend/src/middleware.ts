import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Redirect authenticated users trying to access auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to access protected pages
  if (!isPublicPath && !token) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Add paths that should be protected by authentication
export const config = {
  matcher: [
    '//:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/signin',
    '/signup',
  ],
};