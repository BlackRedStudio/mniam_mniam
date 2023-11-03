import { categories } from "@/lib/config";

export type THTTPMethod =
    | 'GET'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';


export type TOpenFoodFactsProduct = {
    _id: string;
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

export type TCategories = typeof categories;
export type TCategoriesIds = TCategories[number]['id'];

export type TLogin = 'credentials' | 'google' | 'github';

