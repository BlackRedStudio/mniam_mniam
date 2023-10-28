'use server';

import { imageUploadSchema } from '@/validation/product-validation';
import { CompleteMultipartUploadCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function uploadProductPhoto(formData: FormData) {
    try {
        const s3Client = new S3Client({});

        const parsed = imageUploadSchema.safeParse({
            image: formData.get('image'),
        });

        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: 'products/' + parsed.data.image.name,
                Body: parsed.data.image,
                ContentType: parsed.data.image.type,
            },
        });

        const res = await upload.done() as CompleteMultipartUploadCommandOutput;
        console.log(res.Location);

        return {
            success: true,
            message: 'Zdjęcie przesłane poprawnie.',
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
