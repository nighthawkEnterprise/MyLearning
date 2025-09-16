export const runtime = 'edge';
import { auth0 } from '@/lib/auth0';

export const GET = (req) => auth0.handleLogin(req);
