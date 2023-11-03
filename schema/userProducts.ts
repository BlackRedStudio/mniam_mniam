import { float, mysqlEnum, mysqlTable, timestamp, tinyint, varchar } from 'drizzle-orm/mysql-core';
import { products, users } from '.';
import { relations } from 'drizzle-orm';

export const userProducts = mysqlTable('userProducts', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    productId: varchar('productId', { length: 255 }).notNull(),
    rating: tinyint('rating').notNull(),
    price: float('price').notNull(),
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

export const userProductsRelations = relations(userProducts, ({ one }) => ({
    user: one(users, {
        fields: [userProducts.productId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [userProducts.productId],
        references: [products.id],
    }),
}));

export type TUserProduct = typeof userProducts.$inferSelect;
