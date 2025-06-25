import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Only protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    console.log('🔒 Middleware protecting admin route:', pathname);
    
    // Check for authentication cookie/token
    const adminToken = request.cookies.get('admin_token')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');
    
    // For now, redirect to login if no token present
    // Note: We can't verify the token in middleware easily with our current setup
    // So we'll rely on client-side verification for now
    
    console.log('🎫 Admin token present:', !!adminToken);
    
    // If no token at all, immediate redirect
    if (!adminToken) {
      console.log('🚫 No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin paths including root /admin
     */
    '/admin',
    '/admin/((?!login).*)',
  ],
}; 