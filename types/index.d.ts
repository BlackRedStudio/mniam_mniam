import NextAuth, { DefaultSession } from "next-auth"
import { TUserRoles } from "./types";

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
      role: TUserRoles,
    } & DefaultSession["user"]
  }

  interface User {
    role?: TUserRoles | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    uid: string,
    role: TUserRoles,
  }
}
