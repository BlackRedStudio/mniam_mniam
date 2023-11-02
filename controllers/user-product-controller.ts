'use server'

import { products, TUserProduct, userProducts } from '@/models';
import { userProductSchema } from '@/validation/user-product-validation';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { TCategoriesIds, TOpenFoodFactsProduct } from '@/types/types';
import { db } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { addProductDB } from './product-controller';

export async function addProductToUserList(
    openFoodFactsProduct: TOpenFoodFactsProduct,
    rating: number,
    price: string,
    category: TCategoriesIds | '',
    status: TUserProduct['status'],
) {
    try {
        if (!openFoodFactsProduct) throw new Error();

        const existingProduct = await db.query.products.findFirst({
            where: eq(products.ean, openFoodFactsProduct._id),
        });
        let productId = '';
        let existingUserProduct = null;

        if (existingProduct) {
            productId = existingProduct?.id;
            existingUserProduct = await db.query.userProducts.findFirst({
                where: eq(userProducts.productId, productId),
            });
        } else {
            const res = await addProductDB(openFoodFactsProduct);

            if (!res.success || !res.productId) {
                return {
                    success: false,
                    message: res.message,
                };
            }
            productId = res.productId;
        }

        const parsed = userProductSchema.safeParse({
            rating,
            price,
            category,
            status,
        });

        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        const userProductId = crypto.randomUUID();

        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const userProductsValues = {
            id: userProductId,
            productId,
            userId: session.user.id,
            rating: parsed.data.rating,
            price: parsed.data.price,
            category: parsed.data.category,
            status: parsed.data.status,
        };

        if (existingUserProduct) {
            await db.update(userProducts).set(userProductsValues).where(eq(userProducts.id, existingUserProduct.id));
        } else {
            await db.insert(userProducts).values(userProductsValues);
        }

        return {
            success: true,
            message: 'Produkt został dodany',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
