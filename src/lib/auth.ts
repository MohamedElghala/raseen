import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/passwords';
import { findUserByEmail, createUser } from '@/lib/userService';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        const isValid = verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      if (account?.provider === 'google') {
        try {
          const existing = await findUserByEmail(user.email);
          if (!existing) {
            await createUser({
              email: user.email,
              name: user.name || 'مستخدم رَصين',
              avatar: user.image || null,
              role: 'buyer',
            });
          }
        } catch (error) {
          console.warn('Silent fallback on Google signIn user sync:', error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'buyer';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || 'buyer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'raseen_production_super_secret_auth_token_2026_key_998877',
};
