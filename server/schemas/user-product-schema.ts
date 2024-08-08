import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { TUserProductStatus } from '@/types/types';

import { productsTable, TProduct, usersTable } from '.';

export const userProductsTable = sqliteTable('userProducts', {
    id: text('id', { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('userId', { length: 255 }).notNull(),
    productId: text('productId', { length: 255 }).notNull(),
    rating: integer('rating').default(0).notNull(),
    price: integer('price').default(0).notNull(),
    category: text('category', {
        length: 256,
    }).notNull(),
    status: text('status', { length: 255 })
        .$type<TUserProductStatus>()
        .notNull()
        .default('invisible'),
    firstRate: integer('firstRate', { mode: 'boolean' })
        .notNull()
        .default(false),
    imgUploaded: integer('imgUploaded', { mode: 'boolean' })
        .notNull()
        .default(false),
    propsAdded: integer('propsAdded', { mode: 'boolean' })
        .notNull()
        .default(false),
    dateCreated: integer('dateCreated', { mode: 'timestamp_ms' }).default(
        sql`(CURRENT_TIMESTAMP)`,
    ),
    dateUpdated: integer('dateUpdated', { mode: 'timestamp_ms' }).default(
        sql`(CURRENT_TIMESTAMP)`,
    ),
});

export const userProductsRelations = relations(
    userProductsTable,
    ({ one }) => ({
        user: one(usersTable, {
            fields: [userProductsTable.userId],
            references: [usersTable.id],
        }),
        product: one(productsTable, {
            fields: [userProductsTable.productId],
            references: [productsTable.id],
        }),
    }),
);

export type TUserProduct = typeof userProductsTable.$inferSelect;

export type TUserProductWithProduct = TUserProduct & {
    product: TProduct;
};

export type TUserProductInsert = typeof userProductsTable.$inferInsert;
