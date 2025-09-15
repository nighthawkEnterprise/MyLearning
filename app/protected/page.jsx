// Server Component: reads HttpOnly cookies and passes them to the client UI
import { cookies } from 'next/headers'
import ProtectedPageClient from './ProtectedPageClient'

export default function ProtectedPage() {
  const jar = cookies()
  const access  = jar.get('access_token')?.value || ''
  const refresh = jar.get('refresh_token')?.value || ''

  // Pass raw values. The client UI will mask by default and offer Reveal/Copy.
  return <ProtectedPageClient initialTokens={{ access, refresh }} />
}
