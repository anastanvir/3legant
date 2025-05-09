// lib/appAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { auth as pagesAuth } from './auth';


type SessionUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export function auth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Try Pages Router auth first
    try {
      const pagesResponse = await pagesAuth(req as any);
      if (pagesResponse) return pagesResponse;
    } catch (e) {
      // Fall through to App Router handling
    }

    // App Router handling
    const token = await getToken({ req });

    if (!token?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Type-safe auth user
    const authUser = token.user as SessionUser;

    // Add auth to request
    (req as any).auth = { user: authUser };

    return handler(req);
  };
}
