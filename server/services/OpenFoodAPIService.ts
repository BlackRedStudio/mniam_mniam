import { TOpenFoodFactsProductRes, TOpenFoodFactsProductSearchRes } from "@/types/types";
import { api } from "../../lib/utils/utils";

const url = 'https://world.openfoodfacts.org/cgi';
const urlV2 = 'https://world.openfoodfacts.org/api/v2';
const urlProduct = 'https://world.openfoodfacts.net/cgi';

class OpenFoodAPIService {

    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/product/-barcode-
    static async getProductsByBarcode(barcode: string) {

        const data = await api<TOpenFoodFactsProductRes>(`${urlV2}/product/${barcode}`, 'GET', {
            fields: 'product_name,brands,image_url,image_small_url,_id,quantity'
        });
    
        return data?.product;
    }

    // https://world.openfoodfacts.org/cgi/search.pl
    static async searchProduct(name: string, language: string) {

        const data = await api<TOpenFoodFactsProductSearchRes>(`${url}/search.pl`, 'GET', {
            fields: 'product_name,brands,image_url,image_small_url,_id,quantity',
            search_terms: name,
            tagtype_0: 'languages',
            tag_contains_0: 'contains',
            tag_0: language,
            sort_by: 'unique_scans_n',
            page_size: '50',
            search_simple: '1',
            json: '1',
        });
        return data?.products;
    }

    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#post-/cgi/product_jqm2.pl
    static async addProduct(ean: string, name: string, brands: string, categories: string) {

        const data = await api<TOpenFoodFactsProductSearchRes>(`${urlProduct}/product_jqm2.pl`, 'POST', {
            code: ean,
            brands,
            categories,
            labels: name,
            user_id: process.env.OPEN_FOOD_API_USER_ID as string,
            password: process.env.OPEN_FOOD_API_USER_PASSWORD as string,
        }, true);
        return data?.products;
    }
    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#post-/cgi/product_image_upload.pl
    static async uploadProductPhoto(ean: string, img: string) {

        const data = await api<TOpenFoodFactsProductSearchRes>(`${urlProduct}/product_image_upload.pl`, 'POST', {
            code: ean,
            imagefield: 'front_pl',
            imgupload_front_pl: img,
        }, true);
        return data?.products;
    }
}

export default OpenFoodAPIService;
