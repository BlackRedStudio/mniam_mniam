import { relations, sql } from 'drizzle-orm';
import {
    integer,
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';

import { TUserRole } from '@/types/types';

import { accountsTable, TUserProduct, userProductsTable } from '.';
import { ticketsTable } from './ticket-schema';

export const usersTable = sqliteTable('users', {
    id: text('id').notNull().$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull(),
    password: text('password'),
    role: text('role')
        .$type<TUserRole>()
        .notNull()
        .default('user'),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
    image: text('image'),
    darkMode: integer('darkMode', { mode: 'boolean' }).default(false),
    dateCreated: integer('dateCreated', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
    accounts: many(accountsTable),
    userProducts: many(userProductsTable),
    tickets: many(ticketsTable),
}));

export type TUserWithUserProduct = TUser & {
    userProducts: TUserProduct[];
};

export type TUser = typeof usersTable.$inferSelect;
export type TUserInsert = typeof usersTable.$inferInsert;
