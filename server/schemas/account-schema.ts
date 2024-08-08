import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { usersTable } from '.';

export const accountsTable = sqliteTable('accounts', {
    userId: text('userId', { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: text('type', { length: 255 })
        .$type<AdapterAccount['type']>()
        .notNull(),
    provider: text('provider', { length: 255 }).notNull(),
    providerAccountId: text('providerAccountId', {
        length: 255,
    }).notNull(),
    refresh_token: text('refresh_token', { length: 255 }),
    access_token: text('access_token', { length: 255 }),
    expires_at: integer('expires_at'),
    token_type: text('token_type', { length: 255 }),
    scope: text('scope', { length: 255 }),
    id_token: text('id_token'),
});

export const accountsRelations = relations(accountsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [accountsTable.userId],
        references: [usersTable.id],
    }),
}));

export type TAccount = typeof accountsTable.$inferSelect;
export type TAccountInsert = typeof accountsTable.$inferInsert;
