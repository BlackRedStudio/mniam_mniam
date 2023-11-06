import { relations } from 'drizzle-orm';
import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { accounts, userProducts } from '.';

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
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    userProducts: many(userProducts),
}));

export type TUser = typeof users.$inferSelect;