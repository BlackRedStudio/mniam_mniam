import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { TTicketAuthor } from '@/types/types';

import { usersTable } from '.';

export const ticketsTable = sqliteTable('tickets', {
    id: text('id', { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('userId', { length: 255 }).notNull(),
    subject: text('subject', { length: 255 }),
    message: text('message').default(''),
    attachment: text('attachment', { length: 255 }),
    author: text('author', { length: 255 })
        .$type<TTicketAuthor>()
        .notNull()
        .default('user'),
    dateCreated: integer('dateCreated', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
});

export const ticketsRelations = relations(ticketsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [ticketsTable.userId],
        references: [usersTable.id],
    }),
}));

export type TTicket = typeof ticketsTable.$inferSelect;
export type TTicketInsert = typeof ticketsTable.$inferInsert;
