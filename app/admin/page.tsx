import { cookies } from 'next/headers'
import AdminClient from '@/components/AdminClient'

export default function AdminPage() {
  const cookieStore = cookies()
  const authed = cookieStore.get('admin_auth')?.value === '1'
  return <AdminClient authed={authed} />
}
