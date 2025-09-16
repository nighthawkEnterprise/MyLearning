// app/api/_diag/auth0/route.ts  (or .js)
export async function GET() {
    return Response.json({
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
      APP_BASE_URL: process.env.APP_BASE_URL,
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      hasSecret: !!process.env.AUTH0_SECRET,
      hasClientId: !!process.env.AUTH0_CLIENT_ID,
    })
  }
  