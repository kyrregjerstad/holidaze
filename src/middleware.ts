import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nameCookie = request.cookies.get('name')?.value || null;
  const accessToken = request.cookies.get('accessToken')?.value || null;

  const response = NextResponse.next();

  if (!accessToken && nameCookie) {
    response.cookies.set('name', '', { expires: new Date(0) });
  }

  return response;
}
