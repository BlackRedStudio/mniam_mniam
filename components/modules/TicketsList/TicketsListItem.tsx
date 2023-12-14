import Image from 'next/image';
import { TTicket } from '@/server/schemas';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';

type TTicketsListItemProps = {
    ticket: TTicket;
};

function TicketsListItem({ ticket }: TTicketsListItemProps) {
    return (
        <Card className={ticket.author === 'admin' ? `border-orange`: ``}>
            <CardHeader className="p-3">
                {ticket.author === 'admin' && <CardTitle className='text-xl text-orange'>Od Admina:</CardTitle>}
                <CardTitle className='text-xl'>{ticket.subject}</CardTitle>
                <CardDescription>
                    <small>{ticket.dateCreated.toLocaleString()}</small>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
                {ticket.attachment && (
                    <div className="relative h-[200px] w-full">
                        <Image
                            src={ticket.attachment}
                            fill
                            className="object-contain"
                            alt=""
                        />
                    </div>
                )}
                <p>{ticket.message}</p>
            </CardContent>
        </Card>
    );
}

export default TicketsListItem;
