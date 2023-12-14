import { ChangeEvent, ReactNode, SetStateAction } from 'react';
import Image from 'next/image';
import FileResizer from 'react-image-file-resizer';

import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils/utils';

import FormError from '../ui/FormError';
import { Input } from '../ui/Input';

type TImageUploadFieldProps = {
    image: File | null;
    setImage: (value: SetStateAction<File | null>) => void;
    formErrorImage?: string[];
    imageWidth: number;
    imageHeight: number;
    textSuccess?: string;
    beforeInputElement?: ReactNode;
    destructiveElement?: ReactNode;
    capture?: boolean;
    className?: string;
    name?: string;
};

function ImageUploadField({
    image,
    setImage,
    formErrorImage,
    imageWidth,
    imageHeight,
    textSuccess = 'Podgląd obrazka',
    destructiveElement,
    beforeInputElement,
    capture = false,
    className,
    name = 'image',
}: TImageUploadFieldProps) {
    const { toast } = useToast();

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            return;
        }
        const file = e.target.files[0];

        try {
            FileResizer.imageFileResizer(
                file,
                imageWidth,
                imageHeight,
                'JPEG',
                79,
                0,
                file => {
                    if (file instanceof File) {
                        setImage(file);
                    } else {
                        throw new Error('Zły format pliku');
                    }
                },
                'file',
                100,
                100,
            );
        } catch (err) {
            toast({
                title: 'Problem z plikiem, spróbuj ponownie lub zmień na inny plik.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div>
            {image ? (
                <>
                    <div className="mt-5 text-center text-success">
                        {textSuccess}
                    </div>
                    <div className="relative h-[300px] w-full">
                        <Image
                            src={URL.createObjectURL(image)}
                            fill
                            className="object-contain"
                            alt={textSuccess}
                        />
                    </div>
                </>
            ) : (
                destructiveElement
            )}
            {beforeInputElement}
            <Input
                type="file"
                name={name}
                className={cn('mt-5', className)}
                onChange={handleSelectImage}
                accept="image/*"
                capture={capture}
            />
            <FormError className="mb-2" formErrors={formErrorImage} />
        </div>
    );
}

export default ImageUploadField;
