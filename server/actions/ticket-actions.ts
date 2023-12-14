'use server'

import { ticketValidator } from '@/lib/validators/ticket-validator';

import CriticalError from '../errors/CriticalError';
import ParsedError from '../errors/ParsedError';
import { checkSession } from '../helpers/helpers';
import TicketService from '../services/TicketService';
import TicketRepository from '../repositories/TicketRepository';
import { revalidatePath } from 'next/cache';

export async function getUserTickets__Action() {
    try {
        const session = await checkSession();

        const tickets = await TicketRepository.many(session.user.id);

        return {
            success: true as const,
            message: 'Zgłoszenia zostały pobrane.',
            tickets,
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}

export async function submitTicket__Action(formData: FormData) {
    try {
        const session = await checkSession();

        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const attachment = formData.get('attachment') as File | null;

        const parsed = ticketValidator.safeParse({
            subject,
            message,
            attachment: attachment !== null ? attachment : undefined,
        });

        TicketService.submitTicket(session.user.id, subject, message, attachment);
 
        if (!parsed.success) {
            return { ...new ParsedError(parsed.error.formErrors.fieldErrors) };
        }

        revalidatePath('/ticket');

        return {
            success: true as const,
            message: 'Wiadomość została wysłana poprawnie.',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}
