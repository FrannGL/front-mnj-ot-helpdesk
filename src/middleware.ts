import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/auth/(.*)', '/api/webhooks(.*)']);
const isAdminRoute = createRouteMatcher(['/admin/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { sessionClaims } = await auth();

  if (isAdminRoute(req)) {
    const role = (sessionClaims?.public_metadata as { role?: string })?.role;

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } else {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
