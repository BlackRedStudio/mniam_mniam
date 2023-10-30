import { TOpenFoodFactsProduct } from '@/types/types';
import { atomWithLocalStorage } from './store-helpers';

// helper for store atoms in session storage
export const openFoodFactsProductStore = atomWithLocalStorage<TOpenFoodFactsProduct>('openFoodFactsProductStore', null);
