'use server'

import { ticketValidator } from '@/lib/validators/ticket-validator';

import CriticalError from '../errors/CriticalError';
import ParsedError from '../errors/ParsedError';
import { checkSession } from '../helpers/helpers';

export async function submitTicket__Action(formData: FormData) {
    try {
        await checkSession();

        const message = formData.get('message') as string;
        const attachment = formData.get('attachment') as File | 'null';

        const parsed = ticketValidator.safeParse({
            message,
            image: attachment,
        });

        if (!parsed.success) {
            return { ...new ParsedError(parsed.error.formErrors.fieldErrors) };
        }

        return {
            success: true as const,
            message: 'Wiadomość została wysłana poprawnie.',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}
