import { TOpenFoodFactsProductRes, TOpenFoodFactsProductSearchRes } from "@/types/types";
import { api } from "../../lib/utils/utils";

class OpenFoodAPIService {

    static url: 'https://world.openfoodfacts.org/cgi';
    static urlV2: 'https://world.openfoodfacts.org/api/v2';

    // https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/product/-barcode-
    static async getProductsByBarcode(barcode: string) {

        const data = await api<TOpenFoodFactsProductRes>(`${this.url}/product/${barcode}`, 'GET', {
            fields: 'product_name,brands,image_url,image_small_url,_id,quantity'
        });
    
        return data?.product;
    }

    // https://world.openfoodfacts.org/cgi/search.pl
    static async searchProduct(name: string, language: string) {

        const data = await api<TOpenFoodFactsProductSearchRes>(`${this.url}/search.pl`, 'GET', {
            fields: 'product_name,brands,image_url,image_small_url,_id,quantity',
            search_terms: name,
            tagtype_0: 'languages',
            tag_contains_0: 'contains',
            tag_0: language,
            sort_by: 'unique_scans_n',
            page_size: 50,
            search_simple: 1,
            json: 1,
        });
    
        return data?.products;
    }
}

export default OpenFoodAPIService;
