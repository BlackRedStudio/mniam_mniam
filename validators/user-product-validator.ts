import { z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config';
import { handleCurrencyInput } from '@/lib/utils';

export const userProductValidator = z.object({
    rating: z.number().min(1).max(5),
    price: z.string().refine(field => {
        return handleCurrencyInput(field);
    }),
    category: z.enum(
        categories.map(cat => cat.id) as [TCategoriesIds, ...TCategoriesIds[]],
    ),
    status: z.enum(['visible', 'invisible']),
});

export type TUserProductValidator = z.infer<typeof userProductValidator>;
