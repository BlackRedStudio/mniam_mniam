'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

function ProductScanner() {
    const [code, setCode] = useState('');
    const router = useRouter();

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
                disabled={code.length !== 8 && code.length !== 13}
                onClick={() => {
                    router.push(`/product/${code}`);
                }}>
                Wyszukaj produkt
            </Button>
        </>
    );
}

export default ProductScanner;
