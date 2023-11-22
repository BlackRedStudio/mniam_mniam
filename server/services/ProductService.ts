import { Readable } from 'stream';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { eq, like, sql } from 'drizzle-orm';

import { TOpenFoodFactsProduct, TProductStatus } from '@/types/types';

import { DB } from '../helpers/DB';
import {
    productsTable,
    TProduct,
    TProductInsert,
    userProductsTable,
} from '../schema';

class ProductService {
    static async findByName(name: string) {
        const res = await DB.query.productsTable.findMany({
            where: like(productsTable.name, `%${name}%`),
        });

        return res;
    }

    static async findByStatus(status: TProductStatus) {
        const res = await DB.query.productsTable.findMany({
            where: eq(productsTable.status, status),
        });

        return res;
    }

    static async findFirstByEan(ean: string) {
        const res = await DB.query.productsTable.findFirst({
            where: eq(productsTable.ean, ean),
            with: {
                userProducts: {
                    extras: {
                        price: sql<string>`cast(${userProductsTable.price} as CHAR)`.as(
                            'price',
                        ),
                    },
                },
            },
        });
        return res;
    }

    static async uploadPhoto(src: string | File, ean: string) {
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

        return res.Location;
    }

    static async insert(
        product: Omit<TProductInsert, 'id' | 'img'>,
        img: string | File,
    ) {
        const photoUrl = (await this.uploadPhoto(img, product.ean)) || '';

        const id = crypto.randomUUID();

        await DB.insert(productsTable).values({
            ...product,
            id,
            img: photoUrl,
        });

        return id;
    }

    static async update(product: TProduct) {
        const res = await DB.update(productsTable)
            .set(product)
            .where(eq(productsTable.id, product.id));

        return res;
    }

    static async deleteByProductId(productId: string) {
        await DB.delete(productsTable).where(eq(productsTable.id, productId));
    }

    static mapToApiProduct(product: TProduct): TOpenFoodFactsProduct {
        return {
            _id: product.ean,
            brands: product.brands,
            product_name: product.name,
            image_url: product.img,
            quantity: product.quantity,
        };
    }
}

export default ProductService;
