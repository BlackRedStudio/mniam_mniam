import { LucideIcon } from 'lucide-react';

import { categories } from '@/lib/config/config';
import { Icons } from '@/components/modules/Icons';

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

export type TOpenFoodFactsAddProductRes = {
    status: 0 | 1;
    status_verbose: string;
} | null;

export type TOpenFoodFactsUploadPhotoProductRes = {
    files: {
        url: string;
        filename: string;
        name: string;
        thumbnailUrl: string;
        code: string;
    }[];
    image: {
        thumb_url: string;
        imgid: number;
        crop_url: string;
    };
    imgid: number;
    status: string;
    imagefield: string;
    code: string;
} | null;

export type TCategories = typeof categories;
export type TCategoriesIds = TCategories[number]['id'];

export type TLogin = 'credentials' | 'google' | 'github';

export type TUserRole = 'user' | 'admin';

export type TUserProductStatus =
    | 'visible'
    | 'invisible'
    | 'draft'
    | 'draftVisible';

export type TProductStatus = 'active' | 'draft';

export type TTicketAuthor = 'user' | 'admin';

export type TProductStatistics = {
    averageRating: string;
    averagePrice: string;
    peopleCount: number;
};

export type TUserRankingCounter = {
    name: string | null;
    image: string | null;
    totalProductsRateCount: number;
    firstRateCount: number;
    propsAddedCount: number;
    imgUploadedCount: number;
};

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type FilterOptionType = {
    label: string;
    value: string;
    icon?: LucideIcon;
};

export type FilterType = {
    id: string;
    type: 'input' | 'select';
    placeholder: string;
    options?: FilterOptionType[];
};

export type TRankingType = {
    icon: keyof typeof Icons;
    type: 'total' | 'first' | 'attributes' | 'photo';
    name: string;
    key:
        | 'totalProductsRateCount'
        | 'firstRateCount'
        | 'propsAddedCount'
        | 'imgUploadedCount';
};
