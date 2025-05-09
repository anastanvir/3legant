// types/next-auth.d.ts
import { NextRequest } from 'next/server';
import { DefaultSession, DefaultUser, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }

  interface JWT extends DefaultJWT {
    user?: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    };
  }
}

declare module 'next/server' {
  interface NextRequest {
    auth?: {
      user?: {
        _id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      };
    };
  }
}
