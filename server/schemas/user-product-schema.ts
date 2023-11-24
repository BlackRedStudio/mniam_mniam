import { relations } from 'drizzle-orm';
import {
    boolean,
    decimal,
    mysqlTable,
    timestamp,
    tinyint,
    varchar,
} from 'drizzle-orm/mysql-core';

import { TProduct, productsTable, usersTable } from '.';
import { TUserProductStatus } from '@/types/types';

export const userProductsTable = mysqlTable('userProducts', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    productId: varchar('productId', { length: 255 }).notNull(),
    rating: tinyint('rating').notNull(),
    price: decimal('price', { precision: 7, scale: 2 }).notNull(),
    category: varchar('category', {
        length: 256,
    }).notNull(),
    status: varchar('status', { length: 255 }).$type<TUserProductStatus>().notNull().default('invisible'),
    firstRate: boolean('firstRate').notNull().default(false),
    imgUploaded: boolean('imgUploaded').notNull().default(false),
    propsAdded: boolean('propsAdded').notNull().default(false),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
    dateUpdated: timestamp('dateUpdated', {
        mode: 'date',
        fsp: 3,
    }).defaultNow(),
});

export const userProductsRelations = relations(userProductsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userProductsTable.productId],
        references: [usersTable.id],
    }),
    product: one(productsTable, {
        fields: [userProductsTable.productId],
        references: [productsTable.id],
    }),
}));

export type TUserProduct = typeof userProductsTable.$inferSelect;

export type TUserProductWithProduct = TUserProduct & {
    product: TProduct
};

export type TUserProductInsert = typeof userProductsTable.$inferInsert;
