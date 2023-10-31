import { TOpenFoodFactsProduct } from '@/types/types';
import { atom } from 'jotai';

// helper for store atoms in session storage
export const openFoodFactsProductStore = atom<TOpenFoodFactsProduct>(null);
