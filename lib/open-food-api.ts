'use server'

import { api } from "./utils";

const urlV2 = 'https://world.openfoodfacts.net/api/v2';

export async function getProductsByBarcode(barcode: number) {

    const data = await api(`${urlV2}/product/${barcode}`, 'GET', {
        fields: 'product_name,brands'
    });

    return data;
}
// https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/search
export async function searchProduct(barcode: number) {

    const data = await api(`${urlV2}/search`, 'GET', {
        fields: 'product_name,brands'
    });

    return data;
}
