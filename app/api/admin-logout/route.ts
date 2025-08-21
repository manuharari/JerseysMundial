import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/admin', req.url))
  res.headers.set('Set-Cookie', serialize('admin_auth', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  }))
  return res
}
