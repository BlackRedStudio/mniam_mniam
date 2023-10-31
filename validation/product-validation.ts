import { userProducts } from '@/models/userProduct';
import { z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config';

const MAX_FILE_SIZE = 1048576;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export const imageUploadSchema = z.object({
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

export type TImageUploadType = z.infer<typeof imageUploadSchema>;

export const userProductSchema = z.object({
    rating: z.number().min(1).max(5),
    price: z
        .string()
        .regex(/[0-9\.]/)
        .min(1)
        .max(5),
    category: z
        .string()
        .refine(field =>
            categories.map(cat => cat.id).includes(field as TCategoriesIds),
        ),
    status: z.enum(userProducts.status.enumValues),
});
