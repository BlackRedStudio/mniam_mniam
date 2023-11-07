'use client';

import Image from 'next/image';
import { TGetMyListReturn } from '@/actions/user-product-actions';

import { Unpacked } from '@/types/types';
import { Card, CardHeader } from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';

type TProductListItemProps = {
    userProduct: NonNullable<Unpacked<TGetMyListReturn['userProductsList']>>;
};

function ProductListItem({ userProduct }: TProductListItemProps) {
    return (
        <Link href={`/product/${userProduct.product.ean}`}>
            <Card>
            <CardHeader className="p-2 space-y-0">
                <div className="relative h-24">
                    <Image
                        src={userProduct.product.img}
                        alt={userProduct.product.name}
                        className="object-cover rounded-lg"
                        fill
                    />
                </div>
                <H3 className="text-center mt-2">{userProduct.product.name}</H3>
                <small className='block text-center'>({userProduct.product.quantity})</small>
                <StarRating rating={userProduct.rating} showHeader={false} bigStars={false} />
            </CardHeader>
        </Card>
        </Link>
    );
}

export default ProductListItem;
