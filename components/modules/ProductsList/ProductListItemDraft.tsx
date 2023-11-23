'use client';

import Image from 'next/image';

import { Card, CardHeader } from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import Link from 'next/link';
import { cn } from '@/lib/utils/utils';
import { TProduct } from '@/server/schema';

type TProductListItemDraftProps = {
    product: TProduct;
};

function ProductListItemDraft({ product: {ean, name, quantity, img, status} }: TProductListItemDraftProps) {

    const itemUrl = `/product-verification/${ean}`;

    return (
        <Link href={itemUrl}>
            <Card>
            <CardHeader className={cn(
                'p-2 space-y-0 relative overflow-hidden',
                status === 'draft' ? 'opacity-50' : ''
            )}>
                <div className="relative h-24">
                    <Image
                        src={img}
                        alt={name}
                        className="object-contain rounded-lg"
                        fill
                    />
                </div>
                <H3 className="text-center mt-2 truncate">{name}</H3>
                <small className='block text-center truncate'>({quantity})</small>
            </CardHeader>
        </Card>
        </Link>
    );
}

export default ProductListItemDraft;
