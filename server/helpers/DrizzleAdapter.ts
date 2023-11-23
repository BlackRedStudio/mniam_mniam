import type { Adapter } from '@auth/core/adapters';
import { and, eq } from 'drizzle-orm';
import { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';

import { usersTable } from '@/server/schema/user-schema';
import { accountsTable } from '@/server/schema/account-schema';

export function DrizzleAdapter(client: PlanetScaleDatabase): Adapter {
    return {
        async createUser(data) {
            const id = crypto.randomUUID();

            await client.insert(usersTable).values({ ...data, id });

            return await client
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, id))
                .then(res => res[0]);
        },
        async getUser(data) {
            const thing =
                (await client
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.id, data))
                    .then(res => res[0])) ?? null;

            return thing;
        },
        async getUserByEmail(data) {
            const user =
                (await client
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.email, data))
                    .then(res => res[0])) ?? null;

            return user;
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error('No user id.');
            }

            await client.update(usersTable).set(data).where(eq(usersTable.id, data.id));

            return await client
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, data.id))
                .then(res => res[0]);
        },
        async linkAccount(rawAccount) {
            await client.insert(accountsTable).values(rawAccount);
        },
        async getUserByAccount(account) {
            const dbAccount =
                (await client
                    .select()
                    .from(accountsTable)
                    .where(
                        and(
                            eq(
                                accountsTable.providerAccountId,
                                account.providerAccountId,
                            ),
                            eq(accountsTable.provider, account.provider),
                        ),
                    )
                    .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
                    .then(res => res[0])) ?? null;

            if (!dbAccount) {
                return null;
            }

            return dbAccount.users;
        },
        async deleteUser(id) {
            const user = await client
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, id))
                .then(res => res[0] ?? null);

            await client.delete(usersTable).where(eq(usersTable.id, id));

            return user;
        },
        async unlinkAccount(account) {
            await client
                .delete(accountsTable)
                .where(
                    and(
                        eq(
                            accountsTable.providerAccountId,
                            account.providerAccountId,
                        ),
                        eq(accountsTable.provider, account.provider),
                    ),
                );

            return undefined;
        },
    };
}
