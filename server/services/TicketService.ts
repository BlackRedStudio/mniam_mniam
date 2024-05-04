import { uploadFormImage } from '../helpers/helpers';
import TicketRepository from '../repositories/TicketRepository';

class TicketService {
    static async submitTicket(
        userId: string,
        subject: string,
        message: string,
        attachment?: File | null,
    ) {
        let location = '';

        if (attachment) {
            const res = await uploadFormImage(attachment, 'tickets');

            if (res) location = res;
        }

        await TicketRepository.insert({
            userId,
            subject,
            message,
            author: 'user',
            attachment: location,
        });
    }
}

export default TicketService;
