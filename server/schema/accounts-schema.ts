import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { usersTable } from '.';

export const accountsTable = mysqlTable('accounts', {
    userId: varchar('userId', { length: 255 }).notNull().primaryKey(),
    type: varchar('type', { length: 255 })
        .$type<AdapterAccount['type']>()
        .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', {
        length: 255,
    }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
});

export const accountsRelations = relations(accountsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [accountsTable.userId],
        references: [usersTable.id],
    }),
}));

export type TAccount = typeof accountsTable.$inferSelect;
