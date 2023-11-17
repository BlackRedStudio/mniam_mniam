'use server';

import { revalidatePath } from 'next/cache';
import { products, TUserProduct, userProducts } from '@/schema';
import { productValidator } from '@/validators/product-validator';
import { userProductValidator } from '@/validators/user-product-validator';
import { and, eq, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { TUserProductStatus } from '@/types/types';
import { db } from '@/lib/db';
import { getProductsByBarcode } from '@/lib/open-food-api';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { addProductDB } from './product-actions';

export type TAddProductToUserListReturn = Awaited<
    ReturnType<typeof addProductToUserList>
>;

export async function addProductToUserList(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const ean = formData.get('ean') as string;
        const name = formData.get('name') as string;
        const brands = formData.get('brands') as string;
        const quantity = formData.get('quantity') as string;
        const image = formData.get('image') as File;

        const parsed = userProductValidator.safeParse({
            rating: formData.get('rating'),
            price: formData.get('price'),
            category: formData.get('category'),
            status: formData.get('status'),
        });

        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        const existingProduct = await db.query.products.findFirst({
            where: eq(products.ean, ean),
        });
        let productId = '';
        let existingUserProduct = null;
        let isCustomProduct = false;
        let noProductPhoto = false;

        if (existingProduct) {
            productId = existingProduct.id;
            isCustomProduct = (existingProduct.status === 'draft');
            existingUserProduct = await db.query.userProducts.findFirst({
                where: and(
                    eq(userProducts.productId, productId),
                    eq(userProducts.userId, session.user.id),
                ),
            });
        } else {
            const openFoodFactsProduct = await getProductsByBarcode(ean);

            noProductPhoto = !openFoodFactsProduct?.image_url;

            const productParsed = productValidator
                .partial({
                    // make partial only if image exist on openFoodFactsProduct
                    image: noProductPhoto ? undefined : true,
                })
                .safeParse({
                    name: openFoodFactsProduct?.product_name || name,
                    brands: openFoodFactsProduct?.brands || brands,
                    quantity: openFoodFactsProduct?.quantity || quantity,
                    // omit parsing when image_url exist in openFoodFactsProduct
                    image: noProductPhoto ? image : undefined,
                });

            if (!productParsed.success) {
                return {
                    success: false,
                    message:
                        'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                };
            }

            // any properties missing? So it's custom user product
            if (
                !openFoodFactsProduct?.product_name ||
                !openFoodFactsProduct?.brands ||
                noProductPhoto ||
                !openFoodFactsProduct?.quantity
            ) {
                isCustomProduct = true;
            }

            const productDB = {
                ean: openFoodFactsProduct?._id || ean,
                brands:
                    openFoodFactsProduct?.brands || productParsed.data.brands,
                name:
                    openFoodFactsProduct?.product_name ||
                    productParsed.data.name,
                quantity:
                    openFoodFactsProduct?.quantity ||
                    productParsed.data.quantity,
                imgOpenFoodFacts: openFoodFactsProduct?.image_url,
                status: isCustomProduct ? 'draft' as const : 'active' as const,
            };

            // productParsed.data.image can't be undefined because if openFoodFactsProduct.image_url is empty then image parse is mandatory
            const img =
                openFoodFactsProduct?.image_url ||
                (productParsed.data.image as File);

            const res = await addProductDB(productDB, img);

            if (!res.success || !res.productId) {
                return {
                    success: false,
                    message: res.message,
                };
            }
            productId = res.productId;
        }

        const userProductId = crypto.randomUUID();

        let status: TUserProduct['status'] = parsed.data.status;

        if (isCustomProduct && status == 'visible') {
            status = 'draftVisible';
        } else if (isCustomProduct) {
            status = 'draft';
        }

        const userProductsValues = {
            id: userProductId,
            productId,
            userId: session.user.id,
            rating: parsed.data.rating,
            price: parsed.data.price,
            category: parsed.data.category,
            status,
        };

        if (existingUserProduct) {
            await db
                .update(userProducts)
                .set(userProductsValues)
                .where(eq(userProducts.id, existingUserProduct.id));
        } else {
            await db.insert(userProducts).values({
                ...userProductsValues,
                firstRate: (typeof existingProduct === 'undefined'),
                imgUploaded: noProductPhoto,
                propsAdded: isCustomProduct,
            });
        }

        revalidatePath(`/product/${ean}`, 'page');
        revalidatePath('/my-list', 'page');
        revalidatePath('/product-verification', 'page');
        revalidatePath(`/product/${ean}`, 'page');

        return {
            success: true,
            message:
                parsed.data.status === 'visible'
                    ? 'Produkt został oceniony oraz dodany do listy.'
                    : 'Produkt został oceniony.',
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

        await db
            .update(userProducts)
            .set({
                status: 'invisible',
            })
            .where(
                and(
                    eq(userProducts.id, userProductId),
                    eq(userProducts.userId, session.user.id),
                ),
            );

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

export type TGetUserProductsReturn = Awaited<
    ReturnType<typeof getUserProducts>
>;

export async function getUserProducts(statuses: TUserProductStatus[]) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const userProductsList = await db.query.userProducts.findMany({
            where: and(
                eq(userProducts.userId, session.user.id),
                inArray(userProducts.status, statuses),
            ),
            with: {
                product: true,
            },
        });

        return {
            success: true,
            userProductsList,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
