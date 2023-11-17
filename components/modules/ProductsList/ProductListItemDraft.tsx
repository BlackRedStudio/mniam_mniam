'use client';

import Image from 'next/image';

import { Unpacked } from '@/types/types';
import { Card, CardHeader } from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TGetProductsReturn } from '@/actions/product-actions';

type TProductListItemDraftProps = {
    product: NonNullable<Unpacked<TGetProductsReturn['productsList']>>;
};

function ProductListItemDraft({ product }: TProductListItemDraftProps) {

    const itemUrl = `/product-verification/${product.ean}`;

    return (
        <Link href={itemUrl}>
            <Card>
            <CardHeader className={cn(
                'p-2 space-y-0 relative overflow-hidden',
                status === 'draftVisible' ? 'opacity-50' : ''
            )}>
                <div className="relative h-24">
                    <Image
                        src={product.img}
                        alt={product.name}
                        className="object-contain rounded-lg"
                        fill
                    />
                </div>
                <H3 className="text-center mt-2 truncate">{product.name}</H3>
                <small className='block text-center truncate'>({product.quantity})</small>
            </CardHeader>
        </Card>
        </Link>
    );
}

export default ProductListItemDraft;
