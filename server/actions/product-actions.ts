'use server';

import OpenFoodAPIService from '@/server/services/OpenFoodAPIService';

import {
    TOpenFoodFactsProduct,
    TProductStatistics,
    TProductStatus,
} from '@/types/types';
import { productValidator } from '@/lib/validators/product-validator';

import CriticalError from '../errors/CriticalError';
import Error from '../errors/Error';
import { checkSession, revalidateProductPaths } from '../helpers/helpers';
import ProductService from '../services/ProductService';
import UserProductService from '../services/UserProductService';
import ParsedError from '../errors/ParsedError';
import UserProductRepository from '../repositories/UserProductRepository';
import ProductRepository from '../repositories/ProductRepository';

// search product by name using DB, or if not exist using API
export async function searchProductAction(name: string) {
    try {
        let products: TOpenFoodFactsProduct[];
        let extendedSearch = false;

        const productsDB = await ProductRepository.searchByName(name);

        if (productsDB.length > 0) {
            products = productsDB.map(product =>
                ProductService.mapToApiProduct(product),
            );
            extendedSearch = true;
        } else {
            const productsApiPL =
                (await OpenFoodAPIService.searchProduct(name, 'pl')) ?? [];
            const productsApiEN =
                (await OpenFoodAPIService.searchProduct(name, 'en')) ?? [];

            products = [...productsApiPL, ...productsApiEN];
        }
        if (!products || products.length === 0) {
            return {...new Error('Nie znaleziono produktów')};
        }

        return {
            success: true as const,
            message: 'Pobrano produkt.',
            extendedSearch,
            products,
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}

// search product By Name using API
export async function searchProductExtendedAction(name: string) {
    try {
        const productsApiPL =
            (await OpenFoodAPIService.searchProduct(name, 'pl')) ?? [];
        const EANs = productsApiPL.map(product => product?._id);
        const productsApiEN =
            (await OpenFoodAPIService.searchProduct(name, 'en')) ?? [];

        const products = [
            ...productsApiPL,
            // remove products with same EAN as in PL
            ...productsApiEN?.filter(
                product => EANs.indexOf(product?._id) === -1,
            ),
        ];

        if (!products || products.length === 0) {
            return {...new Error('Nie znaleziono produktów')};
        }

        return {
            success: true as const,
            message: 'Pobrano produkt.',
            products,
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}

export async function getProductAction(ean: string) {
    try {
        const session = await checkSession(true);

        let product: TOpenFoodFactsProduct | undefined;

        const productDB = await ProductRepository.firstWithUserProducts({ean});

        if (productDB) {
            product = ProductService.mapToApiProduct(productDB);
        } else {
            product = await OpenFoodAPIService.getProductsByBarcode(ean);
        }

        if (!product) {
            return {...new Error('Nie znaleziono produktów')};
        }

        let productStatistics: TProductStatistics = {
            averageRating: 'Brak',
            averagePrice: 'Brak',
            peopleRateCount: 0,
        };
        if (productDB) {
            productStatistics = UserProductService.getStatistics(
                productDB.userProducts,
            );
        }
        const currentUserProduct = productDB?.userProducts.find(
            userProduct => userProduct.userId === session.user.id,
        );

        return {
            success: true as const,
            message: 'Pobrano produkt.',
            currentUserProduct,
            productStatistics,
            product,
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}

export async function getProductsAction(status: TProductStatus) {
    try {
        await checkSession(true);

        const productsList = await ProductRepository.first({status});

        if (productsList.length === 0) {
            return {...new Error('Nie znaleziono produktów')};
        }

        return {
            success: true as const,
            message: 'Pobrano produkty.',
            productsList,
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}

export async function acceptProductVerificationAction(formData: FormData) {
    try {
        await checkSession(true);

        const ean = formData.get('ean') as string;
        const name = formData.get('name') as string;
        const brands = formData.get('brands') as string;
        const quantity = formData.get('quantity') as string;
        const image = formData.get('image') as File | 'null';

        let isImage = true;
        // 'null' because formData if something is NULL, will coerce to string
        if (image === 'null') {
            isImage = false;
        }
        const product = await ProductRepository.firstWithUserProducts({ean});

        if (!product) return {...new Error('Produkt nie istnieje')};

        const parsed = productValidator
            .partial({
                // make partial if no new image from verificator
                image: isImage ? undefined : true,
            })
            .safeParse({
                name,
                brands,
                quantity,
                image: isImage ? image : undefined,
            });

        if (!parsed.success) {
            return {...new ParsedError(parsed.error.formErrors.fieldErrors)};
        }

        let imgUrl = product.img;

        if (isImage) {
            const photoUrl = await ProductService.uploadPhoto(image, product.ean);

            if (photoUrl) {
                imgUrl = photoUrl;
            } else {
                return {...new Error('Wystąpił błąd z przesłaniem zdjęcia.')};
            }
        }

        const productValues = {
            brands,
            name,
            quantity,
            ean,
            img: imgUrl,
            status: 'active' as const,
        };

        await ProductRepository.update(product.id, productValues);

        await UserProductRepository.makeActive(product.id);

        revalidateProductPaths(ean);

        return {
            success: true as const,
            message: 'Produkt został zatwierdzony poprawnie',
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}

export async function rejectProductVerificationAction(ean: string) {
    try {
        await checkSession(true);

        const product = await ProductRepository.firstWithUserProducts({ean});

        if(!product) return {...new Error('Produkt nie istnieje')};

        await UserProductRepository.deleteByProductId(product.id);
        await ProductRepository.delete(product.id);

        revalidateProductPaths(ean);

        return {
            success: true as const,
            message: 'Produkt został odrzucony poprawnie.',
        };
    } catch (e) {
        return {...new CriticalError(e)};
    }
}
