import TicketForm from '@/components/modules/TicketForm';
import TicketsList from '@/components/modules/TicketsList/TicketsList';
import H2 from '@/components/ui/H2';
import { getUserTickets__Action } from '@/server/actions/ticket-actions';

async function ticketPage() {

    const res = await getUserTickets__Action();
    
    return (
        <section>
            <H2 className="mb-3">Zgłoś uwagę lub pomysł</H2>
            <p>
                Za pomocą poniższego formularza, możesz zgłosić wszelkie
                znalezione błedy, a także podzielić się swoimi przemyśleniami,
                sugestiami lub nowymi pomysłami dotyczącymi naszej aplikacji.
            </p>
            <TicketForm />
            {<TicketsList tickets={res.tickets} />}
        </section>
    );
}

export default ticketPage;
