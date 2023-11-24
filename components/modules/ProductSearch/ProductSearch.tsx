'use client';

import { useState } from 'react';
import {
    searchProductAction,
    searchProductExtendedAction,
} from '@/server/actions/product-actions';

import { TOpenFoodFactsProduct } from '@/types/types';
import { useToast } from '@/lib/hooks/use-toast';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Loader from '../../ui/Loader';
import ProductSearchItem from './ProductSearchItem';

function ProductSearch() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [productList, setProductList] = useState<
        TOpenFoodFactsProduct[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [extendedSearch, setExtendedSearch] = useState(false);

    let productListWrapper = null;

    if (productList) {
        productListWrapper = (
            <div>
                {productList.map(
                    product =>
                        product && (
                            <ProductSearchItem
                                key={product._id}
                                product={product}
                            />
                        ),
                )}
                {extendedSearch ? (
                    <Button
                        className="mt-5 w-full"
                        onClick={async () => {
                            setLoading(true);
                            setProductList(null);
                            const res = await searchProductExtendedAction(name);

                            toast({
                                title: res.message,
                                variant: res.success
                                    ? 'success'
                                    : 'destructive',
                            });

                            if (res.success) {
                                setProductList(res.products);
                                setExtendedSearch(false);
                            }

                            setLoading(false);
                        }}>
                        Szukanie rozszerzone
                    </Button>
                ) : null}
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <Label htmlFor="name">Szukana nazwa produktu</Label>
                <Input
                    className="mt-1"
                    id="name"
                    name="name"
                    placeholder="Wpisz nazwę produktu lub jej część"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <Button
                className="mt-5 w-full"
                onClick={async () => {
                    setLoading(true);
                    setProductList(null);
                    const res = await searchProductAction(name);

                    toast({
                        title: res.message,
                        variant: res.success ? 'success' : 'destructive',
                    });

                    if (res.success) {
                        setProductList(res.products);

                        if (res.extendedSearch) {
                            setExtendedSearch(true);
                        }
                    }

                    setLoading(false);
                }}>
                Wyszukaj produkt po nazwie
            </Button>
            {loading && <Loader className="mt-4" />}
            {productListWrapper}
        </>
    );
}

export default ProductSearch;
