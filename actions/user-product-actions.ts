'use server'

import { products, TUserProduct, userProducts } from '@/schema';
import { userProductValidator } from '@/validators/user-product-validator';
import { and, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { TCategoriesIds } from '@/types/types';
import { db } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { addProductDB } from './product-actions';
import { revalidatePath } from 'next/cache';
import { getProductsByBarcode } from '@/lib/open-food-api';

export async function addProductToUserList(
    ean: string,
    rating: number,
    price: string,
    category: TCategoriesIds | '',
    status: TUserProduct['status'],
) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const existingProduct = await db.query.products.findFirst({
            where: eq(products.ean, ean),
        });
        let productId = '';
        let existingUserProduct = null;

        if (existingProduct) {
            productId = existingProduct?.id;
            existingUserProduct = await db.query.userProducts.findFirst({
                where: and(
                    eq(userProducts.productId, productId),
                    eq(userProducts.userId, session.user.id),
                ),
            });
        } else {
            const openFoodFactsProduct = await getProductsByBarcode(ean);

            if(!openFoodFactsProduct) throw Error('Produkt o podanym Barcode nie istnieje');

            const res = await addProductDB(openFoodFactsProduct);

            if (!res.success || !res.productId) {
                return {
                    success: false,
                    message: res.message,
                };
            }
            productId = res.productId;
        }

        const parsed = userProductValidator.safeParse({
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

        revalidatePath('/product/[ean]', 'page');

        return {
            success: true,
            message: parsed.data.status === 'visible' ? 'Produkt został oceniony oraz dodany do listy.' : 'Produkt został oceniony.',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function deleteProductFromUserList(userProductId: string) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        await db.update(userProducts).set({
            status: 'invisible'
        }).where(and(
            eq(userProducts.id, userProductId),
            eq(userProducts.userId, session.user.id)
        ))

        revalidatePath('/product/[ean]', 'page');

        return {
            success: true,
            message: 'Produkt został pomyślnie usunięty z listy',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export type TGetMyListReturn = Awaited<ReturnType<typeof getMyList>>;

export async function getMyList() {
    
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const userProductsList = await db.query.userProducts.findMany({
            where: and(
                eq(userProducts.userId, session.user.id),
                eq(userProducts.status, 'visible'),
            ),
            with: {
                product: true
            }
        });

        return {
            success: true,
            userProductsList,
        }

    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
