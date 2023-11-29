import { Readable } from 'stream';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { TOpenFoodFactsProduct } from '@/types/types';

import { TProduct } from '../schemas';
import OpenFoodAPIService from './OpenFoodAPIService';

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

    static async getOpenFoodsProducts(name: string) {
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

        return products;
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
