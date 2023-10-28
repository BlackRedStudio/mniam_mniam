import { bigint, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('users', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 512 }).notNull(),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3
    }).defaultNow(),
    dateUpdated: timestamp('dateUpdated', {
        mode: 'date',
        fsp: 3
    }).defaultNow(),
});

export type TProduct = typeof products.$inferSelect;
