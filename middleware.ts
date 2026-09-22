import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next();
  }

  if (!pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }

  const configuredSecret = process.env.ADMIN_APPROVAL_SECRET || '';
  if (!configuredSecret) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const providedSecret = searchParams.get('secret') || request.cookies.get('afk-admin-secret')?.value || '';

  if (providedSecret !== configuredSecret) {
    const redirectUrl = new URL('/admin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();

  if (searchParams.get('secret')) {
    response.cookies.set('afk-admin-secret', configuredSecret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};