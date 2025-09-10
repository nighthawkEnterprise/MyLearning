import { redirect } from 'next/navigation';
import { auth0 } from '../../lib/auth0'; // or '../../../lib/auth0' if no alias

export default async function Protected() {
  const session = await auth0.getSession();
  if (!session) redirect('/auth/login?returnTo=/protected');

  return (
    <main className="p-6">
      <h1>Protected</h1>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <a href="/auth/logout">Log out</a>
    </main>
  );
}
