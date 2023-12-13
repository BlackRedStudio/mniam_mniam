import { typeToFlattenedError, z } from 'zod';

import { imageValidator } from './image-validator';

export const ticketValidator = z.object({
    message: z
        .string()
        .min(10, 'Treść wiadomości musi mieć minimum 10 znaków')
        .max(5000, 'Treść wiadomości może mieć maksimum 5000 znaków'),
    attachment: imageValidator.optional(),
});

export type TTicketValidatorErrors = typeToFlattenedError<
    typeof ticketValidator._input
>['fieldErrors'];
