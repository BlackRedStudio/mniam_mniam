'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TUserProductWithProduct } from '@/server/schemas';

import { cn } from '@/lib/utils/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';

type TProductListItemProps = {
    userProduct: TUserProductWithProduct;
};

function ProductListItem({
    userProduct: { status, rating, product },
}: TProductListItemProps) {
    const itemUrl = `/product/${product.ean}`;

    return (
        <Link href={itemUrl}>
            <Card>
                <CardHeader
                    className={cn(
                        'relative space-y-0 overflow-hidden p-2',
                        status === 'draftVisible' ? 'opacity-50' : '',
                    )}>
                    <div className="relative h-24">
                        <Image
                            src={product.img}
                            alt={product.name}
                            className="rounded-lg object-contain"
                            fill
                        />
                    </div>
                    <H3 className="mt-2 truncate text-center">
                        {product.name}
                    </H3>
                    <small className="block truncate pb-2 text-center">
                        ({product.quantity})
                    </small>
                    <StarRating
                        className="justify-center"
                        rating={rating}
                        showHeader={false}
                        bigStars={false}
                    />
                    {status === 'draftVisible' && (
                        <div className="absolute bottom-24 left-[-100px] h-3 w-72 rotate-[118deg] bg-gray-500 opacity-50" />
                    )}
                </CardHeader>
            </Card>
        </Link>
    );
}

export default ProductListItem;
