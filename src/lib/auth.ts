import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || 'مستخدم رَصين',
            avatar: user.image || null,
          },
          create: {
            email: user.email,
            name: user.name || 'مستخدم رَصين',
            avatar: user.image || null,
            password: '',
            role: 'buyer',
          },
        });
        return true;
      } catch (error) {
        console.error('Error saving user in Supabase on signIn:', error);
        return true;
      }
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
          });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).role = dbUser.role;
          }
        } catch (e) {
          console.error('Error fetching user from Supabase:', e);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'raseen_production_super_secret_auth_token_2026_key_998877',
};
