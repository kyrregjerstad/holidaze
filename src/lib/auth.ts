import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginUserReturnSchema, loginUserSchema } from './schema/userSchema';
import { fetchLoginUser } from './services/authService';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } =
          await loginUserSchema.parseAsync(credentials);

        const { res, error } = await fetchLoginUser({
          email,
          password,
        });

        console.log('ACCESS TOKEN: ', res?.data.accessToken);

        if (error || !res?.data) {
          throw new Error('Error logging in');
        }

        return res?.data;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: z.infer<typeof loginUserReturnSchema> & DefaultSession['user'];
    accessToken?: string; // Optional accessToken in the session type
  }

  interface User {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    accessToken?: string;
  }
}
