import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST(req: Request) {
  const body = await req.json()
  const { password } = body || {}
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', serialize('admin_auth', '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  }))
  return res
}
