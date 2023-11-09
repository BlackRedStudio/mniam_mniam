import { z } from 'zod';

const MAX_FILE_SIZE = 1048576;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
];

export const imageUploadValidator = z.object({
    image: z
        .custom<File>()
        .refine(
            file => file?.size <= MAX_FILE_SIZE,
            'Maksymalny rozmiar pliku to 1 MB.',
        )
        .refine(
            file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            'Formaty obsługiwane to jpg, jpeg oraz png',
        ),
});

export type TImageUploadValidator = z.infer<typeof imageUploadValidator>;
