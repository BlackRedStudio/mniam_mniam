'use client';

import Image from 'next/image';

import { Card, CardHeader } from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';
import { cn } from '@/lib/utils/utils';
import { TUserProductWithProduct } from '@/server/schema';

type TProductListItemProps = {
    userProduct: TUserProductWithProduct;
};

function ProductListItem({ userProduct: {status, rating, product} }: TProductListItemProps) {

    const itemUrl = `/product/${product.ean}`;

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
                <small className='block text-center truncate pb-2'>({product.quantity})</small>
                <StarRating className='justify-center' rating={rating} showHeader={false} bigStars={false} />
                {
                    status === 'draftVisible' &&
                    <div className='h-3 opacity-50 bg-gray-500 w-72 left-[-100px] bottom-24 absolute rotate-[118deg]'></div>
                }
            </CardHeader>
        </Card>
        </Link>
    );
}

export default ProductListItem;
