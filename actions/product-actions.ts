'use server';

import { Readable } from 'stream';
import { TProductInsert, TUserProduct, products, userProducts } from '@/schema';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { eq, like, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { TOpenFoodFactsProduct } from '@/types/types';
import { db } from '@/lib/db';
import { getProductsByBarcode, searchProduct } from '@/lib/open-food-api';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import moment from 'moment';

// search product by name using DB, or if not exist using API
export async function searchProductByName(name: string) {
    try {
        let finalProducts: TOpenFoodFactsProduct[] | undefined = [];
        let extendedSearch = false;

        const existingProducts = await db.query.products.findMany({
            where: like(products.name, `%${name}%`),
        });

        if (existingProducts.length > 0) {
            finalProducts = existingProducts.map(product => ({
                _id: product.ean,
                brands: product.brands,
                product_name: product.name,
                image_url: product.img,
                quantity: product.quantity,
            }));
            extendedSearch = true;
        } else {
            const productsPL = (await searchProduct(name, 'pl')) ?? [];
            const productsEN = (await searchProduct(name, 'en')) ?? [];

            finalProducts = [...productsPL, ...productsEN];
        }

        if (!finalProducts || finalProducts.length === 0) {
            return {
                success: false,
                message: 'Nie znaleziono produktów',
            };
        }

        return {
            success: true,
            extendedSearch,
            message: 'Pobrano produkt.',
            products: finalProducts,
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

// search product By Name using API
export async function searchProductByNameExtended(name: string) {
    try {
        const productsPL = (await searchProduct(name, 'pl')) ?? [];
        const EANs = productsPL.map(product => product?._id);
        const productsEN = (await searchProduct(name, 'en')) ?? [];

        const finalProducts = [
            ...productsPL,
            // filter products with same EAN as in PL
            ...productsEN?.filter(product => EANs.indexOf(product?._id) === -1),
        ];

        if (!finalProducts || finalProducts.length === 0) {
            return {
                success: false,
                message: 'Nie znaleziono produktów',
            };
        }

        return {
            success: true,
            message: 'Pobrano produkt.',
            products: finalProducts,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function getProduct(ean: string) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) return null;

        let finalProduct: TOpenFoodFactsProduct | undefined;

        const existingProduct = await db.query.products.findFirst({
            where: eq(products.ean, ean),
            with: {
                userProducts: {
                    extras: {
                        price: sql<string>`cast(${userProducts.price} as CHAR)`.as('price')
                    }
                },
            },
        });

        if (existingProduct) {
            finalProduct = {
                _id: existingProduct.ean,
                brands: existingProduct.brands,
                product_name: existingProduct.name,
                image_url: existingProduct.img,
                quantity: existingProduct.quantity,
            };
        } else {
            finalProduct = await getProductsByBarcode(ean);
        }
        if (!finalProduct) {
            return {
                success: false,
                message: 'Nie znaleziono produktu.',
            };
        }

        // get average rating/price and get user product if exist
        let peopleRateCount = existingProduct?.userProducts.length ?? 0;
        let peoplePriceCount = 0;
        let rating = 0;
        let price = 0;
        let currentUserProduct = null as TUserProduct | null;

        existingProduct?.userProducts.forEach(product => {
            rating += product.rating;

            // price rate should be younger than 180 days
            const halfYearAgo = moment().subtract(180, 'days');

            if(moment(product.dateUpdated) > halfYearAgo) {
                peoplePriceCount++;
                price += parseFloat(product.price);
            }

            if(product.userId === session.user.id) {
                currentUserProduct = product;
            }
        });

        const averageRating = (rating / peopleRateCount).toFixed(2);
        const averagePrice = (price / peoplePriceCount).toFixed(2);

        return {
            success: true,
            message: 'Pobrano produkt.',
            currentUserProduct,
            productStatistics: {
                averageRating,
                averagePrice,
                peopleRateCount
            },
            product: finalProduct,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function uploadProductPhoto(src: string|File, ean: string) {
    try {
        const s3Client = new S3Client({});

        const file = typeof src === 'string' ? await fetch(src).then(r =>
            Readable.fromWeb(r.body as any),
        ) : src;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: `products/${ean}.jpg`,
                Body: file,
                ContentType: 'image/jpeg',
            },
        });

        const res =
            (await upload.done()) as CompleteMultipartUploadCommandOutput;

        return {
            success: true,
            message: 'Zdjęcie przesłane poprawnie.',
            location: res.Location,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function addProductDB(product: Omit<TProductInsert, 'id' | 'img' >, img: string|File) {
    try {

        if(!product) throw Error('Brak produktu');

        let imgLocation = '';

        const resUpload = await uploadProductPhoto(img, product.ean);
        if (resUpload.success) {
            imgLocation = resUpload.location || '';
        }

        const productId = crypto.randomUUID();

        await db.insert(products).values({
            ...product,
            id: productId,
            img: imgLocation
        });

        return {
            success: true,
            productId,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
