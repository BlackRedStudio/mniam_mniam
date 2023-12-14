import { TTicket } from '@/server/schemas';

import TicketsListItem from './TicketsListItem';
import H2 from '@/components/ui/H2';
import { Separator } from '@/components/ui/Separator';

type TTicketsListProps = {
    tickets?: TTicket[];
};

function TicketsList({ tickets }: TTicketsListProps) {
    return (
        <div className='space-y-3'>
            <Separator className='my-8' />
            <H2>Lista Twoich zgłoszeń:</H2>
            {tickets ? tickets.map(ticket => (
                <TicketsListItem key={ticket.id} ticket={ticket} />
            )) : (
                <div className="text-center text-lg">
                    Brak zgłoszeń...
                </div>
            )}
        </div>
    );
}

export default TicketsList;
