import { ChangeEvent } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils/utils';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TProductCardImageProps = {
    image_url?: string;
    product_name?: string;
    isDraft: boolean;
    image: File | null;
    handleSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
};

function ProductCardImage({
    image_url,
    product_name,
    isDraft,
    image,
    handleSelectImage,
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
                <>
                    {image ? (
                        <>
                            <div className="text-success">Pogląd obrazka</div>
                            <div className="relative h-[300px] w-full">
                                <Image
                                    src={URL.createObjectURL(image)}
                                    fill
                                    className="object-contain"
                                    alt="Pogląd obrazka"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-destructive">
                            Brak obrazka <br />
                            (akceptowany format to jpeg/jpg)
                        </div>
                    )}
                    <Input
                        type="file"
                        name="image"
                        className="mt-1"
                        onChange={handleSelectImage}
                        accept="image/*"
                        capture
                    />
                </>
            )}
        </CardContent>
    );
}

export default ProductCardImage;
