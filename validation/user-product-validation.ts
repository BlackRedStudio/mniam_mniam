import { z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config';
import { handleCurrencyInput } from '@/lib/utils';

export const userProductSchema = z.object({
    rating: z.number().min(1).max(5),
    price: z.coerce.number().refine(field => {
        return handleCurrencyInput(String(field));
    }),
    category: z.enum(
        categories.map(cat => cat.id) as [TCategoriesIds, ...TCategoriesIds[]],
    ),
    status: z.enum(['visible', 'invisible']),
});

export type TUserProductSchema = z.infer<typeof userProductSchema>;
