import { Icons } from '@/components/modules/Icons';
import { TRankingType } from '@/types/types';

export type TCategoryType =
    | 'drinks'
    | 'sweets'
    | 'snacks'
    | 'readyMade'
    | 'main'
    | 'other';

type TCategoryTypeItem = {
    id: TCategoryType;
    label: string;
};

export const categoryTypes: TCategoryTypeItem[] = [
    {
        id: 'main',
        label: 'Główne',
    },
    {
        id: 'sweets',
        label: 'Słodkości',
    },
    {
        id: 'snacks',
        label: 'Przekąski',
    },
    {
        id: 'drinks',
        label: 'Napoje',
    },
    {
        id: 'readyMade',
        label: 'Dania gotowe',
    },
    {
        id: 'other',
        label: 'Pozostałe',
    },
];

type TCategoriesItem = {
    id: string;
    label: string;
    icon: keyof typeof Icons;
    type: TCategoryType;
};

export const categories: TCategoriesItem[] = [
    {
        id: 'alcohols',
        label: 'Alkohole',
        icon: 'martini',
        type: 'drinks',
    },
    {
        id: 'bars',
        label: 'Batony',
        icon: 'chocolateBar',
        type: 'sweets',
    },
    {
        id: 'chips',
        label: 'Chipsy',
        icon: 'chips',
        type: 'snacks',
    },
    {
        id: 'cookies',
        label: 'Ciastka',
        icon: 'cakeSlice',
        type: 'sweets',
    },
    {
        id: 'candies',
        label: 'Cukierki',
        icon: 'candy',
        type: 'sweets',
    },
    {
        id: 'chocolates',
        label: 'Czekolady',
        icon: 'chocolate',
        type: 'sweets',
    },
    {
        id: 'chewingGums',
        label: 'Gumy',
        icon: 'shell',
        type: 'sweets',
    },
    {
        id: 'tea',
        label: 'Herbaty',
        icon: 'coffee',
        type: 'drinks',
    },
    {
        id: 'otherReadyMade',
        label: 'Inne gotowe',
        icon: 'chefHat',
        type: 'readyMade',
    },
    {
        id: 'coffee',
        label: 'Kawy',
        icon: 'coffee',
        type: 'drinks',
    },
    {
        id: 'frozenProducts',
        label: 'Mrożonki',
        icon: 'snowflake',
        type: 'readyMade',
    },
    {
        id: 'dairy',
        label: 'Nabiał',
        icon: 'milk',
        type: 'main',
    },
    {
        id: 'drinks',
        label: 'Napoje',
        icon: 'cupSoda',
        type: 'drinks',
    },
    {
        id: 'iceCreams',
        label: 'Lody',
        icon: 'iceCream',
        type: 'sweets',
    },
    {
        id: 'cereals',
        label: 'Płatki',
        icon: 'cereals',
        type: 'main',
    },
    {
        id: 'other',
        label: 'Pozostałe',
        icon: 'utensils',
        type: 'other',
    },
    {
        id: 'saltySnacks',
        label: 'Przekąski',
        icon: 'popcorn',
        type: 'snacks',
    },
    {
        id: 'otherSweets',
        label: 'Słodycze',
        icon: 'lollipop',
        type: 'sweets',
    },
    {
        id: 'jelly',
        label: 'Żelki',
        icon: 'bean',
        type: 'sweets',
    },
];

// 10 MB
export const MAX_FILE_SIZE = 10485760;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg'];

export const rankingTypes: TRankingType[] = [
    {
        icon: 'star',
        type: 'mniamPoints',
        name: 'Mniam Punkty',
        key: 'mniamPoints',
    },
    {
        icon: 'plusCircle',
        type: 'total',
        name: 'Ocenione produkty',
        key: 'totalProductsRateCount',
    },
    {
        icon: 'medal',
        type: 'first',
        name: 'Pierwsze oceny produktów',
        key: 'firstRateCount',
    },
    {
        icon: 'pencil',
        type: 'attributes',
        name: 'Uzupełnione atrybuty produktów',
        key: 'propsAddedCount',
    },
    {
        icon: 'image',
        type: 'photo',
        name: 'Przesłane zdjęcia produktów',
        key: 'imgUploadedCount',
    },
]
