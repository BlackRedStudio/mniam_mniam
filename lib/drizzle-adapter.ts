import type { Adapter } from '@auth/core/adapters';
import { and, eq } from 'drizzle-orm';
import { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';

import { users } from '@/schema/users';
import { accounts } from '@/schema/accounts';

export function drizzleAdapter(client: PlanetScaleDatabase): Adapter {
    return {
        async createUser(data) {
            const id = crypto.randomUUID();

            await client.insert(users).values({ ...data, id });

            return await client
                .select()
                .from(users)
                .where(eq(users.id, id))
                .then(res => res[0]);
        },
        async getUser(data) {
            const thing =
                (await client
                    .select()
                    .from(users)
                    .where(eq(users.id, data))
                    .then(res => res[0])) ?? null;

            return thing;
        },
        async getUserByEmail(data) {
            const user =
                (await client
                    .select()
                    .from(users)
                    .where(eq(users.email, data))
                    .then(res => res[0])) ?? null;

            return user;
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error('No user id.');
            }

            await client.update(users).set(data).where(eq(users.id, data.id));

            return await client
                .select()
                .from(users)
                .where(eq(users.id, data.id))
                .then(res => res[0]);
        },
        async linkAccount(rawAccount) {
            await client.insert(accounts).values(rawAccount);
        },
        async getUserByAccount(account) {
            const dbAccount =
                (await client
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(
                                accounts.providerAccountId,
                                account.providerAccountId,
                            ),
                            eq(accounts.provider, account.provider),
                        ),
                    )
                    .leftJoin(users, eq(accounts.userId, users.id))
                    .then(res => res[0])) ?? null;

            if (!dbAccount) {
                return null;
            }

            return dbAccount.users;
        },
        async deleteUser(id) {
            const user = await client
                .select()
                .from(users)
                .where(eq(users.id, id))
                .then(res => res[0] ?? null);

            await client.delete(users).where(eq(users.id, id));

            return user;
        },
        async unlinkAccount(account) {
            await client
                .delete(accounts)
                .where(
                    and(
                        eq(
                            accounts.providerAccountId,
                            account.providerAccountId,
                        ),
                        eq(accounts.provider, account.provider),
                    ),
                );

            return undefined;
        },
    };
}
