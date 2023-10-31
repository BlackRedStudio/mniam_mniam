'use client';

import { useState } from 'react';
import Link from 'next/link';

import { TOpenFoodFactsProductRes } from '@/types/types';
import { getProductsByBarcode } from '@/lib/open-food-api';
import { Button } from '@/components/ui/button';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSetAtom } from 'jotai';
import { openFoodFactsProductStore } from '@/store/products-store';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';

function ProductScanner() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [productResponse, setProductResponse] = useState<TOpenFoodFactsProductRes>(null);
    const router = useRouter();

    const setOpenFoodFactsProductStore = useSetAtom(openFoodFactsProductStore);

    let searchResults = <div></div>;

    if (productResponse?.product) {
        // searchResults = (
        //     <div>
        //         <strong>Znaleziony produkt:</strong>
        //         <br />
        //         {productResponse.product.product_name} z firmy{' '}
        //         {productResponse.product.brands}
        //         <Link href="/rate-product">
        //             <Button>Oceń produkt</Button>
        //         </Link>
        //     </div>
        // );
    } else if (productResponse?.code === null) {
        searchResults = (
            <div className="text-destructive">Wprowadź numer EAN</div>
        );
    } else if (productResponse?.status === 0) {
        searchResults = (
            <div className="text-destructive">
                Nie znaleziono produktu o podanym numerze EAN
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-3">
                <Button
                    onClick={() => {
                        console.log('Miejsce na skanowanie');
                    }}>
                    Rozpocznij skanowanie
                </Button>
            </div>
            <div className="mb-4">
                <Label htmlFor="name">
                    Zeskanowany lub wpisany ręcznie kod kreskowy
                </Label>
                <Input
                    type="number"
                    className="mt-1"
                    placeholder="Miejsce na kod kreskowy"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
            </div>
            <Button
                className="w-full mt-5"
                onClick={async () => {
                    setLoading(true);
                    const res = await getProductsByBarcode(code);
                    setProductResponse(res || null);
                    
                    if(res?.product) {
                        await setOpenFoodFactsProductStore(res.product);
                        router.push('/rate-product');
                    }
                    setLoading(false);
                }}>
                Wyszukaj produkt
            </Button>
            {
                loading && <Loader className='mt-4' />
            }
            <div className="mt-5">{searchResults}</div>
        </>
    );
}

export default ProductScanner;
