'use client';

import { useState } from 'react';
import Image from 'next/image';
import { searchProductByName } from '@/actions/product-actions';

import { TOpenFoodFactsProduct } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Loader from './ui/Loader';
import Link from 'next/link';

function ProductSearch() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [productList, setProductList] = useState<TOpenFoodFactsProduct[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="mb-4">
                <Label htmlFor="name">Wpisz nazwę produktu lub jej część</Label>
                <Input
                    className="mt-1"
                    id="name"
                    name="name"
                    placeholder="Nazwa produktu"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <Button
                className="w-full mt-5"
                onClick={async () => {
                    setLoading(true);
                    setProductList([]);
                    const res = await searchProductByName(name);
                    toast({
                        title: res.message,
                        variant: res.success ? 'success' : 'destructive',
                    });

                    if (res.success && res.products) {
                        setProductList(res.products);
                    }

                    setLoading(false);
                }}>
                Wyszukaj produkt po nazwie
            </Button>
            {loading && <Loader className="mt-4" />}
            {productList
                ? productList.map(product => (
                      <Link href={`/product/${product?._id}`}>
                          <Button
                              variant={'ghost'}
                              className="p-10 mt-2 text-lg">
                              {product?.image_url && (
                                  <Image
                                      src={product?.image_url}
                                      loading="eager"
                                      className="mr-2"
                                      width={50}
                                      height={50}
                                      alt={product?.product_name || ''}
                                  />
                              )}
                              {product?.product_name}
                          </Button>
                      </Link>
                  ))
                : null}
        </>
    );
}

export default ProductSearch;
