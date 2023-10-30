import { bigint, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 512 }).notNull(),
    brand: varchar('brand', { length: 512 }).notNull(),
    img: text('img').default(''),
    imgOpenFoodFacts: text('imgOpenFoodFacts').default(''),
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
