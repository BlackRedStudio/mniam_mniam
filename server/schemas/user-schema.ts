import { relations } from 'drizzle-orm';
import {
    boolean,
    mysqlTable,
    timestamp,
    tinyint,
    varchar,
} from 'drizzle-orm/mysql-core';

import { TUserRole } from '@/types/types';

import { TUserProduct, accountsTable, userProductsTable } from '.';
import { ticketsTable } from './ticket-schema';

export const usersTable = mysqlTable('users', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }),
    role: varchar('role', { length: 255 })
        .$type<TUserRole>()
        .notNull()
        .default('user'),
    emailVerified: timestamp('emailVerified', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
    image: varchar('image', { length: 255 }),
    darkMode: boolean('darkMode').default(false),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
    accounts: many(accountsTable),
    userProducts: many(userProductsTable),
    tickets: many(ticketsTable),
}));

export type TUserWithUserProduct = TUser & {
    userProducts: TUserProduct[]
};

export type TUser = typeof usersTable.$inferSelect;
export type TUserInsert = typeof usersTable.$inferInsert;
