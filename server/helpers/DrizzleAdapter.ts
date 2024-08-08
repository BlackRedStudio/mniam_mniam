import type { Adapter } from '@auth/core/adapters';
import { and, eq } from 'drizzle-orm';
import { AdapterAccount } from "next-auth/adapters";
import { accountsTable, usersTable } from "../schemas";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

export function DrizzleAdapter(
    client: InstanceType<typeof BaseSQLiteDatabase>,
): Adapter {
    return {
        async createUser(data) {
            return client
                .insert(usersTable)
                .values({ ...data, id: crypto.randomUUID() })
                .returning()
                .get();
        },
        async getUser(data) {
            return (
                await client.select().from(usersTable).where(eq(usersTable.id, data)).get() ??
                null
            );
        },
        async getUserByEmail(data) {
            return (
                await client
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.email, data))
                    .get() ?? null
            );
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error('No user id.');
            }

            return await client
                .update(usersTable)
                .set(data)
                .where(eq(usersTable.id, data.id))
                .returning()
                .get();
        },
        async linkAccount(rawAccount) {
            const updatedAccount = await client
                .insert(accountsTable)
                .values(rawAccount)
                .returning()
                .get();

            const account: AdapterAccount = {
                ...updatedAccount,
                type: updatedAccount.type,
                access_token: updatedAccount.access_token ?? undefined,
                token_type: updatedAccount.token_type ?? undefined,
                id_token: updatedAccount.id_token ?? undefined,
                refresh_token: updatedAccount.refresh_token ?? undefined,
                scope: updatedAccount.scope ?? undefined,
                expires_at: updatedAccount.expires_at ?? undefined,
            };

            return account;
        },
        async getUserByAccount(account) {
            const results = await client
                .select()
                .from(accountsTable)
                .leftJoin(usersTable, eq(usersTable.id, accountsTable.userId))
                .where(
                    and(
                        eq(accountsTable.provider, account.provider),
                        eq(
                            accountsTable.providerAccountId,
                            account.providerAccountId,
                        ),
                    ),
                )
                .get();

            return results?.users ?? null;
        },
        async deleteUser(id) {
            return await client
                .delete(usersTable)
                .where(eq(usersTable.id, id))
                .returning()
                .get();
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
                )
                .run();

            return undefined;
        },
    };
}
