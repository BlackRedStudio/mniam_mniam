import { relations } from 'drizzle-orm';
import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { TProductStatus } from '@/types/types';

import { userProductsTable } from '.';

export const productsTable = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    ean: varchar('ean', { length: 128 }).notNull(),
    name: varchar('name', { length: 512 }).notNull(),
    brands: varchar('brands', { length: 512 }).notNull(),
    quantity: varchar('quantity', { length: 255 }).notNull(),
    status: varchar('status', { length: 255 })
        .$type<TProductStatus>()
        .notNull()
        .default('active'),
    img: text('img').notNull(),
    imgOpenFoodFacts: text('imgOpenFoodFacts').default(''),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
    dateUpdated: timestamp('dateUpdated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
    userProducts: many(userProductsTable),
}));

export type TProduct = typeof productsTable.$inferSelect;
export type TProductInsert = typeof productsTable.$inferInsert;
