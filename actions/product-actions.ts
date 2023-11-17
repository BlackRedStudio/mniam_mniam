'use server';

import { Readable } from 'stream';
import { revalidatePath } from 'next/cache';
import { products, TProductInsert, TUserProduct, userProducts } from '@/schema';
import { productValidator } from '@/validators/product-validator';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { and, eq, like, sql } from 'drizzle-orm';
import moment from 'moment';
import { getServerSession } from 'next-auth';

import { TOpenFoodFactsProduct, TProductStatus } from '@/types/types';
import { db } from '@/lib/db';
import { getProductsByBarcode, searchProduct } from '@/lib/open-food-api';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
                        price: sql<string>`cast(${userProducts.price} as CHAR)`.as(
                            'price',
                        ),
                    },
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

            if (moment(product.dateUpdated) > halfYearAgo) {
                peoplePriceCount++;
                price += parseFloat(product.price);
            }

            if (product.userId === session.user.id) {
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
                peopleRateCount,
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

export type TGetProductsReturn = Awaited<
    ReturnType<typeof getProducts>
>;

export async function getProducts(status: TProductStatus) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        const productsList = await db.query.products.findMany({
            where: eq(products.status, status),
        });

        return {
            success: true,
            productsList,
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function uploadProductPhoto(src: string | File, ean: string) {
    try {
        const s3Client = new S3Client({});

        const file =
            typeof src === 'string'
                ? await fetch(src).then(r => Readable.fromWeb(r.body as any))
                : src;

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

export async function addProductDB(
    product: Omit<TProductInsert, 'id' | 'img'>,
    img: string | File,
) {
    try {
        if (!product) throw Error('Brak produktu');

        let imgLocation = '';

        const resUpload = await uploadProductPhoto(img, product.ean);
        if (resUpload.success) {
            imgLocation = resUpload.location || '';
        }

        const productId = crypto.randomUUID();

        await db.insert(products).values({
            ...product,
            id: productId,
            img: imgLocation,
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

export type TAcceptProductVerificationReturn = Awaited<
    ReturnType<typeof acceptProductVerification>
>;

export async function acceptProductVerification(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();
        if (session.user.role !== 'admin') throw new Error('Permission denied');

        const ean = formData.get('ean') as string;
        const name = formData.get('name') as string;
        const brands = formData.get('brands') as string;
        const quantity = formData.get('quantity') as string;
        const image = formData.get('image') as File | 'null';

        let isImage = true;
        if(image === 'null') {
            isImage = false;
        }
        // get original product
        const product = await db.query.products.findFirst({
            where: eq(products.ean, ean),
        });

        if (!product) throw new Error();

        const parsed = productValidator
            .partial({
                // make partial if no new image from verificator
                image: isImage ? undefined : true,
            })
            .safeParse({
                name: name,
                brands: brands,
                quantity: quantity,
                image: isImage ? image : undefined,
            });

        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        let imgUrl = product.img;

        if (isImage) {
            const resUpload = await uploadProductPhoto(image, product.ean);

            if (resUpload.success && resUpload.location) {
                imgUrl = resUpload.location;
            } else {
                throw new Error();
            }
        }

        const productDB = {
            brands: parsed.data.brands,
            name: parsed.data.name,
            quantity: parsed.data.quantity,
            img: imgUrl,
            status: 'active' as const,
        };

        await db
            .update(products)
            .set(productDB)
            .where(eq(products.id, product.id));

        // update all userProducts draft statuses to invisible
        await db
            .update(userProducts)
            .set({
                status: 'invisible',
            })
            .where(
                and(
                    eq(userProducts.productId, product.id),
                    eq(userProducts.status, 'draft'),
                ),
            );

        // update all userProducts draftVisible statuses to visible
        await db
            .update(userProducts)
            .set({
                status: 'visible',
            })
            .where(
                and(
                    eq(userProducts.productId, product.id),
                    eq(userProducts.status, 'draftVisible'),
                ),
            );

        revalidatePath(`/product/${ean}`, 'page');
        revalidatePath('/my-list', 'page');
        revalidatePath('/product-verification', 'page');
        revalidatePath(`/product-verification/${ean}`, 'page');

        return {
            success: true,
            message: 'Produkt został zatwierdzony poprawnie',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function rejectProductVerification(ean: string) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();
        if (session.user.role !== 'admin') throw new Error('Permission denied');

        const product = await db.query.products.findFirst({
            where: eq(products.ean, ean),
        });

        if (!product) throw new Error();
        
        await db.delete(userProducts).where(
            eq(userProducts.productId, product.id)
        );

        await db.delete(products).where(
            eq(products.id, product.id)
        );

        revalidatePath(`/product/${ean}`, 'page');
        revalidatePath('/my-list', 'page');
        revalidatePath('/product-verification', 'page');
        revalidatePath(`/product-verification/${ean}`, 'page');

        return {
            success: true,
            message: 'Produkt został odrzucony poprawnie.',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
