import NextAuth, { DefaultSession } from "next-auth"

declare module NodeJS {
    interface Process extends NodeJS.Process {
        browser?: string;
    }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
    } & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    uid: string
  }
}
