import { SetStateAction } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils/utils';
import { CardContent } from '@/components/ui/Card';

import ImageUploadField from '../ImageUploadField';

type TProductCardImageProps = {
    image_url?: string;
    product_name?: string;
    isDraft: boolean;
    image: File | null;
    setImage: (value: SetStateAction<File | null>) => void;
};

function ProductCardImage({
    image_url,
    product_name,
    isDraft,
    image,
    setImage,
}: TProductCardImageProps) {
    return (
        <CardContent>
            {image_url ? (
                <div className={'relative h-[300px] w-full'}>
                    <Image
                        src={image_url ?? ''}
                        fill
                        className={cn(
                            'object-contain',
                            isDraft ? 'opacity-50' : '',
                        )}
                        alt={product_name ?? ''}
                    />
                </div>
            ) : (
                <ImageUploadField
                    image={image}
                    className="mt-1"
                    imageHeight={640}
                    imageWidth={640}
                    setImage={setImage}
                    capture={true}
                    destructiveElement={
                        <div className="text-destructive">
                            Brak obrazka <br />
                            (akceptowany format to jpeg/jpg)
                        </div>
                    }
                />
            )}
        </CardContent>
    );
}

export default ProductCardImage;
