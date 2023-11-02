import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { userProducts } from '.';
import { relations } from 'drizzle-orm';

export const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    ean: varchar('ean', { length: 128 }).notNull(),
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

export const productsRelations = relations(products, ({ many }) => ({
    userProducts: many(userProducts),
}));

export type TProduct = typeof products.$inferSelect;
