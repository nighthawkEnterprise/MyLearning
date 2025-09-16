import TeacherDashboardClient from './TeacherDashboardClient'
import { cookies } from 'next/headers'

export const runtime = 'nodejs' // or 'edge' if you prefer

export default function TeacherPage() {
  const c = cookies()
  const access = c.get('access_token')?.value || ''
  const refresh = c.get('refresh_token')?.value || ''
  return <TeacherDashboardClient initialTokens={{ access, refresh }} />
}
