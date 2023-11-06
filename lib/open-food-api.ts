import { TOpenFoodFactsProductRes, TOpenFoodFactsProductSearchRes } from "@/types/types";
import { api } from "./utils";

const url = 'https://world.openfoodfacts.org/cgi';
const urlV2 = 'https://world.openfoodfacts.org/api/v2';

// https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/product/-barcode-
export async function getProductsByBarcode(barcode: string) {

    const data = await api<TOpenFoodFactsProductRes>(`${urlV2}/product/${barcode}`, 'GET', {
        fields: 'product_name,brands,image_url,image_small_url,_id,quantity'
    });

    return data?.product;
}

// https://world.openfoodfacts.org/cgi/search.pl
export async function searchProduct(name: string, tag: string) {

    const data = await api<TOpenFoodFactsProductSearchRes>(`${url}/search.pl`, 'GET', {
        fields: 'product_name,brands,image_url,image_small_url,_id,quantity',
        search_terms: name,
        tagtype_0: 'languages',
        tag_contains_0: 'contains',
        tag_0: tag,
        sort_by: 'unique_scans_n',
        page_size: 50,
        search_simple: 1,
        json: 1,
    });

    return data?.products;
}
