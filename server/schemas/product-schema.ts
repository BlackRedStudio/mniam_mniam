import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

import { TProductStatus } from '@/types/types';

import { userProductsTable } from '.';

export const productsTable = sqliteTable('products', {
    id: text('id', { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    ean: text('ean', { length: 128 }).notNull(),
    name: text('name', { length: 512 }).notNull(),
    brands: text('brands', { length: 512 }).notNull(),
    quantity: text('quantity', { length: 255 }).notNull(),
    status: text('status', { length: 255 })
        .$type<TProductStatus>()
        .notNull()
        .default('active'),
    img: text('img').notNull(),
    imgOpenFoodFacts: text('imgOpenFoodFacts').default(''),
    dateCreated: integer('dateCreated', {mode: 'timestamp_ms'}).default(sql`(CURRENT_TIMESTAMP)`),
    dateUpdated: integer('dateUpdated', {mode: 'timestamp_ms'}).default(sql`(CURRENT_TIMESTAMP)`),
});

export const productsRelations = relations(productsTable, ({ many }) => ({
    userProducts: many(userProductsTable),
}));

export type TProduct = typeof productsTable.$inferSelect;
export type TProductInsert = typeof productsTable.$inferInsert;
