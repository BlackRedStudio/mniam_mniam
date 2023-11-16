'use client';

import Image from 'next/image';
import { TGetUserProductsReturn } from '@/actions/user-product-actions';

import { TProductListType, Unpacked } from '@/types/types';
import { Card, CardHeader } from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type TProductListItemProps = {
    userProduct: NonNullable<Unpacked<TGetUserProductsReturn['userProductsList']>>;
    listType: TProductListType,
};

function ProductListItem({ userProduct, listType }: TProductListItemProps) {

    let itemUrl = `/product/${userProduct.product.ean}`;

    if(listType === 'verification') itemUrl = `/product-verification/${userProduct.product.ean}`;

    return (
        <Link href={itemUrl}>
            <Card>
            <CardHeader className={cn(
                'p-2 space-y-0 relative overflow-hidden',
                userProduct.status === 'draftVisible' ? 'opacity-50' : ''
            )}>
                <div className="relative h-24">
                    <Image
                        src={userProduct.product.img}
                        alt={userProduct.product.name}
                        className="object-contain rounded-lg"
                        fill
                    />
                </div>
                <H3 className="text-center mt-2 truncate">{userProduct.product.name}</H3>
                <small className='block text-center truncate'>({userProduct.product.quantity})</small>
                <StarRating rating={userProduct.rating} showHeader={false} bigStars={false} />
                {
                    userProduct.status === 'draftVisible' &&
                    <div className='h-3 opacity-50 bg-gray-500 w-72 left-[-100px] bottom-24 absolute rotate-[118deg]'></div>
                }
            </CardHeader>
        </Card>
        </Link>
    );
}

export default ProductListItem;
