import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

import { users } from '@/models/user';
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
            allowDangerousEmailAccountLinking: true,
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
            allowDangerousEmailAccountLinking: true,
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
                if (!credentials) return null;

                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email),
                });

                if (user && user.password) {

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                    if(!passwordMatch) return null;

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
