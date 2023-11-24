import { typeToFlattenedError, z } from 'zod';

import { imageValidator } from './image-validator';

export const productValidator = z.object({
    name: z
        .string()
        .min(3, 'Nazwa produktu musi zawierać minimum 3 znaki')
        .max(512, 'Nazwa produktu nie może być dłuższa niż 512 znaków'),
    brands: z
        .string()
        .min(3, 'Pole firmy musi zawierać minimum 3 znaki')
        .max(512, 'Pole firmy nie może być dłuższa niż 512 znaków'),
    quantity: z
        .string()
        .min(2, 'Pole ilość musi zawierać minimum 2 znaki')
        .max(256, 'Pole ilość nie może być dłuższa niż 256 znaków'),
    image: imageValidator,
});

export type TProductValidatorErrors = typeToFlattenedError<
    typeof productValidator._input
>['fieldErrors'];
