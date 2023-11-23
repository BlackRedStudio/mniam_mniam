'use server';

import {
    TUserProduct,
} from '@/server/schema';
import OpenFoodAPIService from '@/server/services/OpenFoodAPIService';

import { TUserProductStatus } from '@/types/types';
import { productValidator } from '@/lib/validators/product-validator';
import { userProductValidator } from '@/lib/validators/user-product-validator';

import CriticalError from '../errors/CriticalError';
import Error from '../errors/Error';
import ParsedError from '../errors/ParsedError';
import { checkSession, revalidateProductPaths } from '../helpers/helpers';
import ProductService from '../services/ProductService';
import UserProductService from '../services/UserProductService';

export async function addProductToUserListAction(formData: FormData) {
    try {
        const session = await checkSession();

        const ean = formData.get('ean') as string;
        const name = formData.get('name') as string;
        const brands = formData.get('brands') as string;
        const quantity = formData.get('quantity') as string;
        const image = formData.get('image') as File;

        const rating = parseInt(formData.get('rating') as string);
        const price = formData.get('price') as string;
        const category = formData.get('category') as string;
        let status = formData.get('status') as TUserProduct['status'];

        const parsed = userProductValidator.safeParse({
            rating,
            price,
            category,
            status,
        });
        if (!parsed.success) {
            return new ParsedError(parsed.error.formErrors.fieldErrors);
        }

        const product = await ProductService.findFirstByEan(ean);
        let productId = '';
        let existingUserProduct = null;
        let isCustomProduct = false;
        let hasPhoto = true;

        if (product) {
            productId = product.id;
            isCustomProduct = product.status === 'draft';
            existingUserProduct = await UserProductService.findFirstUserProduct(
                productId,
                session.user.id,
            );
        } else {
            const openFoodFactsProduct =
                await OpenFoodAPIService.getProductsByBarcode(ean);

            hasPhoto = !!openFoodFactsProduct?.image_url;

            const productParsed = productValidator
                .partial({
                    // make partial only if image exist on openFoodFactsProduct
                    image: hasPhoto ? true : undefined,
                })
                .safeParse({
                    name: openFoodFactsProduct?.product_name || name,
                    brands: openFoodFactsProduct?.brands || brands,
                    quantity: openFoodFactsProduct?.quantity || quantity,
                    // omit parsing when image_url exist in openFoodFactsProduct
                    image: hasPhoto ? undefined : image,
                });

            if (!productParsed.success) {
                return new Error(
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                );
            }

            // any properties missing? So it's custom user product
            if (
                !openFoodFactsProduct?.product_name ||
                !openFoodFactsProduct?.brands ||
                !hasPhoto ||
                !openFoodFactsProduct?.quantity
            ) {
                isCustomProduct = true;
            }

            const productDB = {
                ean: openFoodFactsProduct?._id || ean,
                brands: openFoodFactsProduct?.brands || brands,
                name: openFoodFactsProduct?.product_name || name,
                quantity: openFoodFactsProduct?.quantity || quantity,
                imgOpenFoodFacts: openFoodFactsProduct?.image_url,
                status: isCustomProduct
                    ? ('draft' as const)
                    : ('active' as const),
            };

            // productParsed.data.image can't be undefined because if openFoodFactsProduct.image_url is empty then image parse is mandatory
            const img =
                openFoodFactsProduct?.image_url ||
                (productParsed.data.image as File);

            productId = await ProductService.insert(productDB, img);
        }

        if (isCustomProduct && status == 'visible') {
            status = 'draftVisible';
        } else if (isCustomProduct) {
            status = 'draft';
        }

        const userProductValues = {
            productId,
            userId: session.user.id,
            rating,
            price,
            category,
            status,
        };

        if (existingUserProduct) {
            await UserProductService.update(existingUserProduct.id, userProductValues);
        } else {
            await UserProductService.insert({
                ...userProductValues,
                firstRate: typeof product === 'undefined',
                imgUploaded: !hasPhoto,
                propsAdded: isCustomProduct,
            });
        }

        revalidateProductPaths(ean);

        return {
            success: true as const,
            message:
                parsed.data.status === 'visible'
                    ? 'Produkt został oceniony oraz dodany do listy.'
                    : 'Produkt został oceniony.',
        };
    } catch (e) {
        return new CriticalError(e);
    }
}

export async function deleteProductFromUserListAction(ean: string, userProductId: string) {
    try {
        const session = await checkSession();

        const product = await ProductService.findFirstByEan(ean);

        if(!product) {
            return new Error('Brak produktu.');
        }

        const res = await UserProductService.changeVisibleToInvisible(userProductId, session.user.id);

        if(res.rowsAffected === 0) {
            return new Error('Brak produktu użytkownika.');
        }

        revalidateProductPaths(product.ean);

        return {
            success: true as const,
            message: 'Produkt został pomyślnie usunięty z listy',
        };
    } catch (e) {
        return new CriticalError(e);
    }
}

export type TGetUserProductsActionReturn = Awaited<
    ReturnType<typeof getUserProductsAction>
>;

export async function getUserProductsAction(statuses: TUserProductStatus[]) {
    try {
        const session = await checkSession();

        const userProductsList = await UserProductService.findUserProductsByStatus(session.user.id, statuses);

        if(userProductsList.length === 0) {
            return new Error('Brak produktów.');
        }

        return {
            success: true as const,
            userProductsList,
        };
    } catch (e) {
        return new CriticalError(e);
    }
}
