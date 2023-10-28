import { TOpenFoodFactsProduct } from '@/types/types';
import { atom } from 'jotai';

export const openFoodFactsProductStore = atom<TOpenFoodFactsProduct | null>(null);
