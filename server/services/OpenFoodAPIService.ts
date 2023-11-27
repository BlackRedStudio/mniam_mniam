import {
    TOpenFoodFactsAddProductRes,
    TOpenFoodFactsProductRes,
    TOpenFoodFactsProductSearchRes,
    TOpenFoodFactsUploadPhotoProductRes,
} from '@/types/types';

import { api, splitWords } from '../../lib/utils/utils';

const url = 'https://world.openfoodfacts.org/cgi';
const urlV2 = 'https://world.openfoodfacts.org/api/v2';

class OpenFoodAPIService {
    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/product/-barcode-
    static async getProductsByBarcode(barcode: string) {
        const data = await api<TOpenFoodFactsProductRes>(
            `${urlV2}/product/${barcode}`,
            'GET',
            {
                fields: 'product_name,brands,image_url,image_small_url,_id,quantity',
            },
        );

        return data?.product;
    }

    // https://world.openfoodfacts.org/cgi/search.pl
    static async searchProduct(name: string, language: string) {
        const data = await api<TOpenFoodFactsProductSearchRes>(
            `${url}/search.pl`,
            'GET',
            {
                fields: 'product_name,brands,image_url,image_small_url,_id,quantity',
                search_terms: name,
                tagtype_0: 'languages',
                tag_contains_0: 'contains',
                tag_0: language,
                sort_by: 'unique_scans_n',
                page_size: '50',
                search_simple: '1',
                json: '1',
            },
        );
        return data?.products;
    }

    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#post-/cgi/product_jqm2.pl
    static async addProduct(
        ean: string,
        name: string,
        brands: string,
        quantity: string,
        categories: string,
    ) {
        const bodyContent = new FormData();
        bodyContent.append('code', ean);
        bodyContent.append('product_name_pl', name);
        bodyContent.append(
            'user_id',
            process.env.OPEN_FOOD_API_USER_ID as string,
        );
        bodyContent.append(
            'password',
            process.env.OPEN_FOOD_API_USER_PASSWORD as string,
        );
        bodyContent.append('brands', brands);
        bodyContent.append('quantity', quantity);
        bodyContent.append('categories', splitWords(categories));

        const data = await api<TOpenFoodFactsAddProductRes>(
            `${url}/product_jqm2.pl`,
            'POST',
            bodyContent,
        );

        return data?.status;
    }
    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#post-/cgi/product_image_upload.pl
    static async uploadProductPhoto(ean: string, img: string) {
        const imgStream = await fetch(img);
        const imgBlob = await imgStream.blob();
        const imgFile = new File([imgBlob], ean);

        const bodyContent = new FormData();
        bodyContent.append('code', ean);
        bodyContent.append('imagefield', 'front_pl');
        bodyContent.append('imgupload_front_pl', imgFile);
        bodyContent.append(
            'user_id',
            process.env.OPEN_FOOD_API_USER_ID as string,
        );
        bodyContent.append(
            'password',
            process.env.OPEN_FOOD_API_USER_PASSWORD as string,
        );

        const data = await api<TOpenFoodFactsUploadPhotoProductRes>(
            `${url}/product_image_upload.pl`,
            'POST',
            bodyContent,
        );

        return data?.status;
    }
}

export default OpenFoodAPIService;
