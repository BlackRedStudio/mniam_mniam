import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/config/config';

export const imageValidator = z
    .custom<File>()
    .refine(
        file => file?.size <= MAX_FILE_SIZE,
        'Maksymalny rozmiar pliku to 10 MB.',
    )
    .refine(
        file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Formaty obsługiwane to jpg oraz jpeg',
    );
