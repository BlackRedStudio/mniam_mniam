import { categories } from '@/lib/config';

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
    quantity?: string | null;
} | null;

export type TOpenFoodFactsProductRes = {
    code: string | null;
    product?: TOpenFoodFactsProduct;
    status: 0 | 1;
    status_verbose: string;
} | null;

export type TOpenFoodFactsProductSearchRes = {
    count: number;
    page_count: number;
    page: number;
    page_size: number;
    skip: number;
    products: TOpenFoodFactsProduct[] | [];
} | null;

export type TCategories = typeof categories;
export type TCategoriesIds = TCategories[number]['id'];

export type TLogin = 'credentials' | 'google' | 'github';

export type TUserRole = 'user' | 'admin';

export type TUserProductStatus = 'visible' | 'invisible' | 'draft' | 'draftVisible';

export type TProductListType = 'myList' | 'verification';

export type TProductStatistics = {
    averageRating: string,
    averagePrice: string,
    peopleRateCount: number,
};

export type Unpacked<T> = T extends (infer U)[] ? U : T;
