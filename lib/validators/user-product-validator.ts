import { z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config/config';
import { handleCurrencyInput } from '@/lib/utils/utils';

export const userProductValidator = z.object({
    rating: z.coerce.number().min(1, 'Produkt musi zostać oceniony').max(5),
    price: z.string().refine(field => {
        return handleCurrencyInput(field);
    }, 'Wprowadź wartość'),
    category: z.enum(
        categories.map(cat => cat.id) as [TCategoriesIds, ...TCategoriesIds[]],
        {
            errorMap: () => ({ message: 'Proszę wybrać kategorię' }),
        },
    ),
    status: z.enum(['visible', 'invisible']),
});

export type TUserProductValidator = z.infer<typeof userProductValidator>;
