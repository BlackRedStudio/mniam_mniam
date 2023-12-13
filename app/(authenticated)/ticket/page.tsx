import TicketForm from '@/components/modules/TicketForm';
import H2 from '@/components/ui/H2';

function ticketPage() {
    return (
        <section>
            <H2 className="mb-3">Zgłoś uwagę lub pomysł</H2>
            <p>
                Za pomocą poniższego formularza, możesz zgłosić wszelkie
                znalezione błedy, a także podzielić się swoimi przemyśleniami,
                sugestiami lub nowymi pomysłami dotyczącymi naszej aplikacji.
            </p>
            <TicketForm />
        </section>
    );
}

export default ticketPage;
