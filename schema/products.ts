import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { userProducts } from '.';
import { relations } from 'drizzle-orm';
import { TProductStatus } from '@/types/types';

export const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    ean: varchar('ean', { length: 128 }).notNull(),
    name: varchar('name', { length: 512 }).notNull(),
    brands: varchar('brands', { length: 512 }).notNull(),
    quantity: varchar('quantity', { length: 255 }).notNull(),
    status: varchar('status', { length: 255 }).$type<TProductStatus>().notNull().default('active'),
    img: text('img').notNull(),
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

export const productsRelations = relations(products, ({ many }) => ({
    userProducts: many(userProducts),
}));

export type TProduct = typeof products.$inferSelect;
export type TProductInsert = typeof products.$inferInsert;
