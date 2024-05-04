import { eq } from 'drizzle-orm';

import { DB } from '../helpers/DB';
import { ticketsTable, TTicketInsert } from '../schemas';

class TicketRepository {
    static async insert(ticket: Omit<TTicketInsert, 'id'>) {
        const id = crypto.randomUUID();

        await DB.insert(ticketsTable).values({
            id,
            ...ticket,
        });

        return id;
    }

    static async many(userId: string) {
        const product = await DB.query.ticketsTable.findMany({
            where: eq(ticketsTable.userId, userId),
            orderBy: (ticketsTable, { desc }) => [
                desc(ticketsTable.dateCreated),
            ],
        });

        return product;
    }
}

export default TicketRepository;
