'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProduct } from '@/actions/product-actions';
import { openFoodFactsProductStore } from '@/store/products-store';
import { useSetAtom } from 'jotai';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import { Input } from './ui/input';
import { Label } from './ui/label';
import Loader from './ui/Loader';

function ProductScanner() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const setOpenFoodFactsProductStore = useSetAtom(openFoodFactsProductStore);

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
                <Label htmlFor="code">
                    Zeskanowany lub wpisany ręcznie kod kreskowy
                </Label>
                <Input
                    type="number"
                    id="code"
                    name="code"
                    className="mt-1"
                    placeholder="Miejsce na kod kreskowy"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
            </div>
            <Button
                className="w-full mt-5"
                onClick={() => {
                    // setLoading(true);
                    // const res = await getProduct(code);

                    // toast({
                    //     title: res.message,
                    //     variant: res.success ? 'success' : 'destructive',
                    // });
                    // if (res?.product) {
                    //     setOpenFoodFactsProductStore(res.product);
                        
                    // }
                    // setLoading(false);
                    router.push(`/product/${code}`);
                }}>
                Wyszukaj produkt
            </Button>
            {loading && <Loader className="mt-4" />}
        </>
    );
}

export default ProductScanner;
