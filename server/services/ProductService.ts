import { Readable } from 'stream';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { TOpenFoodFactsProduct } from '@/types/types';

import {
    TProduct,
} from '../schemas';

class ProductService {

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
