'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TProduct } from '@/server/schemas';

import { cn } from '@/lib/utils/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import H3 from '@/components/ui/H3';

type TProductListItemDraftProps = {
    product: TProduct;
};

function ProductListItemDraft({
    product: { ean, name, quantity, img, status },
}: TProductListItemDraftProps) {
    const itemUrl = `/product-verification/${ean}`;

    return (
        <Link href={itemUrl}>
            <Card>
                <CardHeader
                    className={cn(
                        'relative space-y-0 overflow-hidden p-2',
                        status === 'draft' ? 'opacity-50' : '',
                    )}>
                    <div className="relative h-24">
                        <Image
                            src={img}
                            alt={name}
                            className="rounded-lg object-contain"
                            fill
                        />
                    </div>
                    <H3 className="mt-2 truncate text-center">{name}</H3>
                    <small className="block truncate text-center">
                        ({quantity})
                    </small>
                </CardHeader>
            </Card>
        </Link>
    );
}

export default ProductListItemDraft;
