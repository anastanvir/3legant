// lib/routeAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { auth as pagesAuth } from './auth';

// Define the shape of the user object
type SessionUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

// Use environment variable for secret
const secret = process.env.NEXTAUTH_SECRET;

export function auth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      // Try Pages Router auth first
      const pagesResponse = await pagesAuth(req as any);
      if (pagesResponse) return pagesResponse;
    } catch (e) {
      // Fall through to App Router handling
    }

    // App Router handling with secret
    const token = await getToken({ req, secret });

    if (!token?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Cast token.user to SessionUser
    const authUser = token.user as SessionUser;

    // Attach authenticated user to the request
    (req as any).auth = { user: authUser };

    return handler(req);
  };
}
