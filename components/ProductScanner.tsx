'use client';

import { useState } from 'react';

import { getProductsByBarcode } from '@/lib/open-food-api';
import { Button } from '@/components/ui/button';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { TOpenFoodFactsProduct } from '@/types/types';

function ProductScanner() {
    const [code, setCode] = useState('');
    const [product, setProduct] = useState<TOpenFoodFactsProduct>(null);

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
            className='w-full mt-5'
                onClick={async () => {
                    const res = await getProductsByBarcode(code);
                    if(res?.product) {
                        setProduct(res.product);
                    }
                }}>
                Wyszukaj produkt
            </Button>
            {
                product ? <div className="mt-5">
                    <strong>Znaleziony produkt:</strong><br />
                    {product.product_name} z firmy {product.brands}
                </div> : null
            }
        </>
    );
}

export default ProductScanner;
