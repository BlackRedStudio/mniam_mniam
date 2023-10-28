export type THTTPMethod =
    | 'GET'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';


export type TOpenFoodFactsProduct = {
    brands?: string;
    product_name?: string;
    image_url?: string;
    image_small_url?: string;
} | null;

export type TOpenFoodFactsProductRes = {
    code: string | null;
    product?: TOpenFoodFactsProduct;
    status: 0 | 1;
    status_verbose: string;
} | null;
