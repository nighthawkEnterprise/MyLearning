// app/protected/page.jsx
import ProtectedPageClient from './ProtectedPageClient'
import { cookies } from 'next/headers'

export const runtime = 'nodejs' // or 'edge' if you prefer

export default function ProtectedPage() {
  const c = cookies()
  const access = c.get('access_token')?.value || ''
  const refresh = c.get('refresh_token')?.value || ''
  return <ProtectedPageClient initialTokens={{ access, refresh }} />
}
