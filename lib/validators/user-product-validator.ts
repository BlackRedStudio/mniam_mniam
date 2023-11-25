import { typeToFlattenedError, z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config/config';

export const userProductValidator = z.object({
    rating: z.number().min(1, 'Produkt musi zostać oceniony').max(5),
    price: z.number().min(1, 'Cena musi zostać oceniona').max(3),
    category: z.enum(
        categories.map(cat => cat.id) as [TCategoriesIds, ...TCategoriesIds[]],
        {
            errorMap: () => ({ message: 'Proszę wybrać kategorię' }),
        },
    ),
    status: z.enum(['visible', 'invisible']),
});

export type TUserProductValidator = z.infer<typeof userProductValidator>;

export type TUserProductValidatorErrors = typeToFlattenedError<
    typeof userProductValidator._input
>['fieldErrors'];
