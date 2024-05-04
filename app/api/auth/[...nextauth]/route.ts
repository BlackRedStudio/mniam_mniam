import { DB } from '@/server/helpers/DB';
import { DrizzleAdapter } from '@/server/helpers/DrizzleAdapter';
import UserRepository from '@/server/repositories/UserRepository';
import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

export const authOptions = {
    /* eslint-disable */
    adapter: DrizzleAdapter(DB as any) as Adapter,
    /* eslint-enable */
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
                    role: 'user',
                    darkMode: false,
                    image: profile.picture,
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
                    role: 'user',
                    darkMode: false,
                    image: profile.avatar_url,
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

                const user = await UserRepository.firstWithAccounts({
                    email: credentials.email,
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
        // {user} is passed only on sign in
        async jwt({ token, trigger, session, user }) {
            if (trigger === 'update') {
                if (session?.email) {
                    token.email = session.email;
                }
                if (session?.name) {
                    token.name = session.name;
                }
                if (session?.image || session?.image === '') {
                    token.picture = session.image;
                }
                token.darkMode = session.darkMode;
            }

            if (user) {
                token.uid = user.id;
                token.role = user.role || 'user';
                token.darkMode = user.darkMode || false;
            }

            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.uid;
                session.user.role = token.role;
                session.user.darkMode = token.darkMode;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
} as AuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
