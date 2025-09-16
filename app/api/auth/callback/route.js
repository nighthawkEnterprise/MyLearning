export const runtime = 'edge';
import { auth0 } from '@/lib/auth0';

// You can pass options if you want a fixed redirect:
// export const GET = (req) => auth0.handleCallback(req, { redirectTo: '/protected' });
export const GET = (req) => auth0.handleCallback(req);
