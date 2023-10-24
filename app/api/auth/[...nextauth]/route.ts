import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

import { users } from '@/types/schema';
import { db } from '@/lib/db';
import { drizzleAdapter } from '@/lib/drizzle-adapter';

const handler = NextAuth({
    adapter: drizzleAdapter(db as any) as Adapter,
    pages: {
        signIn: '/',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            profile(profile: GoogleProfile) {
                return {
                    ...profile,
                    id: profile.sub,
                };
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            profile(profile: GithubProfile) {
                return {
                    ...profile,
                    id: profile.id.toString(),
                };
            },
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const user = {
                    id: '42',
                    email: 'sebex142@gmail.com',
                    password: 'Test123PL',
                };

                // await db.select().from(users).where(eq(users.id, data));

                if (
                    credentials?.email === user.email &&
                    credentials?.password === user.password
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, trigger, session }) {
            if (trigger === 'update' && session?.email) {
                token.email = session.email;
            }

            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
});

export { handler as GET, handler as POST };
