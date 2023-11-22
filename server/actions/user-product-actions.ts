'use server';

import { revalidatePath } from 'next/cache';
import { productsTable, TUserProduct, userProductsTable } from '@/server/schema';
import { productValidator } from '@/lib/validators/product-validator';
import { userProductValidator } from '@/lib/validators/user-product-validator';
import { and, eq, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { TUserProductStatus } from '@/types/types';
import { DB } from '@/server/helpers/DB';
import { getProductsByBarcode } from '@/server/services/OpenFoodAPIService';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import ProductService from '../services/ProductService';

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

        const existingProduct = await DB.query.productsTable.findFirst({
            where: eq(productsTable.ean, ean),
        });
        let productId = '';
        let existingUserProduct = null;
        let isCustomProduct = false;
        let noProductPhoto = false;

        if (existingProduct) {
            productId = existingProduct.id;
            isCustomProduct = (existingProduct.status === 'draft');
            existingUserProduct = await DB.query.userProductsTable.findFirst({
                where: and(
                    eq(userProductsTable.productId, productId),
                    eq(userProductsTable.userId, session.user.id),
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

            productId = await ProductService.insert(productDB, img);
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
            await DB
                .update(userProductsTable)
                .set(userProductsValues)
                .where(eq(userProductsTable.id, existingUserProduct.id));
        } else {
            await DB.insert(userProductsTable).values({
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

        await DB
            .update(userProductsTable)
            .set({
                status: 'invisible',
            })
            .where(
                and(
                    eq(userProductsTable.id, userProductId),
                    eq(userProductsTable.userId, session.user.id),
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

        const userProductsList = await DB.query.userProductsTable.findMany({
            where: and(
                eq(userProductsTable.userId, session.user.id),
                inArray(userProductsTable.status, statuses),
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
