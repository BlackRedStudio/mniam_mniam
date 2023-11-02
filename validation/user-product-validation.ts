import { userProducts } from '@/models/userProduct';
import { z } from 'zod';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config';
import { handleCurrencyInput } from '@/lib/utils';

export const userProductSchema = z.object({
    rating: z.number().min(1).max(5),
    price: z.coerce.
        number().refine(field => {
            return handleCurrencyInput( String(field) );
        }),
        
    category: z
        .string()
        .refine(field =>
            categories.map(cat => cat.id).includes(field as TCategoriesIds),
        ),
    status: z.enum(userProducts.status.enumValues),
});
