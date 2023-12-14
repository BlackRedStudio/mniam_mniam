import { typeToFlattenedError, z } from 'zod';

import { imageValidator } from './image-validator';

export const ticketValidator = z.object({
    subject: z
        .string()
        .min(3, 'Tytuł musi zawierać minimum 3 znaki')
        .max(512, 'Tytuł nie może być dłuższy niż 512 znaków'),
    message: z
        .string()
        .min(10, 'Treść wiadomości musi mieć minimum 10 znaków')
        .max(5000, 'Treść wiadomości może mieć maksimum 5000 znaków'),
    attachment: imageValidator.optional(),
});

export type TTicketValidatorErrors = typeToFlattenedError<
    typeof ticketValidator._input
>['fieldErrors'];
