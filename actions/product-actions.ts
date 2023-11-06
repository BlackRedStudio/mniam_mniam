'use server';

import { Readable } from 'stream';
import { TUserProduct, products, userProducts } from '@/schema';
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
                brands: product.brand,
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
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

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
                brands: existingProduct.brand,
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
        let rating = 0;
        let price = 0;
        let currentUserProduct = null as TUserProduct | null;

        existingProduct?.userProducts.forEach(product => {
            rating += product.rating;
            price += parseFloat(product.price);

            if(product.userId === session.user.id) {
                currentUserProduct = product;
            }
        });

        const averageRating = (rating / peopleRateCount).toFixed(2);
        const averagePrice = (price / peopleRateCount).toFixed(2);

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

export async function uploadProductPhoto(src: string, ean: string) {
    try {
        const s3Client = new S3Client({});

        // const parsed = imageUploadSchema.safeParse({
        //     image: formData.get('image'),
        // });

        // if (!parsed.success) {
        //     return {
        //         success: false,
        //         message:
        //             'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
        //         errors: parsed.error.formErrors.fieldErrors,
        //     };
        // }

        const readableStream = await fetch(src).then(r =>
            Readable.fromWeb(r.body as any),
        );

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: `products/${ean}.jpg`,
                Body: readableStream,
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

export async function addProductDB(product: TOpenFoodFactsProduct) {
    try {

        if(!product) throw Error('Brak produktu');

        let imgLocation = '';

        if (product?.image_url) {
            const resUpload = await uploadProductPhoto(
                product.image_url,
                product._id,
            );
            if (resUpload.success) {
                imgLocation = resUpload.location || '';
            }
        }

        const productId = crypto.randomUUID();

        await db.insert(products).values({
            id: productId,
            ean: product._id ?? '',
            name: product.product_name ?? '',
            brand: product.brands ?? '',
            quantity: product.quantity ?? '',
            img: imgLocation,
            imgOpenFoodFacts: product?.image_url,
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
