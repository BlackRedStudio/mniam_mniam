import { ChangeEvent, ReactNode, SetStateAction, useState } from 'react';
import Image from 'next/image';
import FileResizer from 'react-image-file-resizer';

import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils/utils';

import FormError from '../ui/FormError';
import { Input } from '../ui/Input';
import { Icons } from './Icons';

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
    extraPreviewClass?: string;
    quality?: number;
};

let rotation = 0;

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
    extraPreviewClass = '',
    quality = 79,
}: TImageUploadFieldProps) {
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);

    const processImage = (file: File) => {
        FileResizer.imageFileResizer(
            file,
            imageWidth,
            imageHeight,
            'JPEG',
            quality,
            rotation,
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
    };

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            return;
        }
        const uploadedFile = e.target.files[0];

        try {
            setFile(uploadedFile);
            processImage(uploadedFile);
        } catch (err) {
            toast({
                title: 'Problem z plikiem, spróbuj ponownie lub zmień na inny plik.',
                variant: 'destructive',
            });
        }
    };

    const handleRotation = () => {
        if (!file) return false;

        rotation += 90;
        if (rotation >= 360) rotation = 0;

        processImage(file);
    };

    return (
        <div>
            {image ? (
                <>
                    <div className="mb-2 mt-5 flex justify-between">
                        <div className="text-center text-success">
                            {textSuccess}
                        </div>
                        <Icons.rotateCw
                            className="cursor-pointer"
                            onClick={handleRotation}
                        />
                    </div>
                    <div
                        className={cn(
                            'relative h-[300px] w-full',
                            extraPreviewClass,
                        )}
                    >
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
