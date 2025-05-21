import { NextResponse } from 'next/server';

import { auth } from 'src/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const publicRoutes = ['/auth/login', '/auth/register', '/api/auth'];

  const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', nextUrl.origin);

    if (nextUrl.pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  if (isLoggedIn && nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
