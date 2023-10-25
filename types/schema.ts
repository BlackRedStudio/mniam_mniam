import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import {
    int,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }),
    emailVerified: timestamp('emailVerified', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
    image: varchar('image', { length: 255 }),
});

export type TUser = typeof users.$inferSelect;

export const accounts = mysqlTable(
    'accounts',
    {
        userId: varchar('userId', { length: 255 })
            .notNull().primaryKey(),
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
        session_state: varchar('session_state', { length: 255 }),
    }
);

export const usersRelations = relations(users, ({ one, many }) => ({
    accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const sessions = mysqlTable('sessions', {
    sessionToken: varchar('sessionToken', { length: 255 })
        .notNull()
        .primaryKey(),
    userId: varchar('userId', { length: 255 })
        .notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = mysqlTable(
    'verificationTokens',
    {
        identifier: varchar('identifier', { length: 255 }).notNull(),
        token: varchar('token', { length: 255 }).notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    }
);
