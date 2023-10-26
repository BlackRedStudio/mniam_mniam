export type THTTPMethod =
    | 'GET'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';


export type TOpenFoodFactsProduct = {
    brands: string;
    product_name: string;
} | null;

export type TOpenFoodFactsProductRes = {
    code: string;
    product: TOpenFoodFactsProduct;
    status: number;
    status_verbose: string;
} | null;
