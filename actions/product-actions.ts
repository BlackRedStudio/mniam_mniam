'use server';

import { products } from '@/schema';
import { Readable } from 'stream';

import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { TOpenFoodFactsProduct } from '@/types/types';
import { db } from '@/lib/db';
import { getProductsByBarcode } from '@/lib/open-food-api';
import { eq } from 'drizzle-orm';

export async function getProduct(ean: string) {
    try {

        let finalProduct = null;

        const existingProduct = await db.query.products.findFirst({
            where: eq(products.ean, ean)
        });
        if(existingProduct) {
            finalProduct = {
                _id: existingProduct.ean,
                brands: existingProduct.brand,
                product_name: existingProduct.name,
                image_url: existingProduct.img,
            }
        } else {
            finalProduct = await getProductsByBarcode(ean);
        }

        return {
            success: true,
            message: 'Pobrano produkt.',
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

        const readableStream = await fetch(src).then(r => Readable.fromWeb(r.body as any));

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
        let imgLocation = '';

        if (product?.image_url) {
            const resUpload = await uploadProductPhoto(product.image_url, product._id);
            if (resUpload.success) {
                imgLocation = resUpload.location || '';
            }
        }

        const productId = crypto.randomUUID();

        await db.insert(products).values({
            id: productId,
            ean: product?._id ?? '',
            name: product?.product_name ?? '',
            brand: product?.brands ?? '',
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
