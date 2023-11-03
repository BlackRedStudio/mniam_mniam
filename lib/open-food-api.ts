import { TOpenFoodFactsProductRes } from "@/types/types";
import { api } from "./utils";

const urlV2 = 'https://world.openfoodfacts.org/api/v2';

// https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/product/-barcode-
export async function getProductsByBarcode(barcode: string) {

    const data = await api<TOpenFoodFactsProductRes>(`${urlV2}/product/${barcode}`, 'GET', {
        fields: 'product_name,brands,image_url,image_small_url,_id'
    });

    if(!data?.product) {
        return null;
    }

    return data.product;
}
// https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/search
export async function searchProduct() {

    const data = await api<TOpenFoodFactsProductRes>(`${urlV2}/search`, 'GET', {
        fields: 'product_name,brands'
    });

    console.log(data);

    return data;
}
