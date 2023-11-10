import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { userProducts } from '.';
import { relations } from 'drizzle-orm';

export const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    ean: varchar('ean', { length: 128 }).notNull(),
    name: varchar('name', { length: 512 }).notNull(),
    brands: varchar('brands', { length: 512 }).notNull(),
    quantity: varchar('quantity', { length: 256 }).notNull(),
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
