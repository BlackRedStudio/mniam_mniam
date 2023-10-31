import { bigint, mysqlEnum, mysqlTable, timestamp, tinyint, varchar } from 'drizzle-orm/mysql-core';

export const userProducts = mysqlTable('userProducts', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    rating: tinyint('rating').notNull(),
    price: varchar('price', {length: 256}).notNull(),
    category: varchar('category', {
        length: 256
    }).notNull(),
    status: mysqlEnum('status', [
        'visible',
        'invisible',
        'draft',
    ]).notNull(),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3
    }).defaultNow(),
    dateUpdated: timestamp('dateUpdated', {
        mode: 'date',
        fsp: 3
    }).defaultNow(),
});

export type TUserProduct = typeof userProducts.$inferSelect;
