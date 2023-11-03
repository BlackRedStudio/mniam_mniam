import { users } from '@/schema/users';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import NextAuth, { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

import { db } from '@/lib/db';
import { drizzleAdapter } from '@/lib/drizzle-adapter';

export const authOptions = {
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
                    const passwordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password,
                    );

                    if (!passwordMatch) return null;

                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.uid;
            }
            return session;
        },
        async jwt({ token, trigger, session, user }) {
            if (trigger === 'update' && session?.email) {
                token.email = session.email;
            }
            if (user) {
                token.uid = user.id;
            }

            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
} as AuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
