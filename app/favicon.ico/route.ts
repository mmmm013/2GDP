import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/gpm_logo.jpg', request.url);
  return NextResponse.redirect(url, { status: 301 });
}
