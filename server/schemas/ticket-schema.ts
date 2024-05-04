import { relations } from 'drizzle-orm';
import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { TTicketAuthor } from '@/types/types';

import { usersTable } from '.';

export const ticketsTable = mysqlTable('tickets', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 255 }),
    message: text('message').default(''),
    attachment: varchar('attachment', { length: 255 }),
    author: varchar('author', { length: 255 })
        .$type<TTicketAuthor>()
        .notNull()
        .default('user'),
    dateCreated: timestamp('dateCreated', {
        mode: 'date',
        fsp: 3,
    })
        .notNull()
        .defaultNow(),
});

export const ticketsRelations = relations(ticketsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [ticketsTable.userId],
        references: [usersTable.id],
    }),
}));

export type TTicket = typeof ticketsTable.$inferSelect;
export type TTicketInsert = typeof ticketsTable.$inferInsert;
