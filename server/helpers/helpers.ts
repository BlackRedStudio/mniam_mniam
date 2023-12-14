import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import AdminError from '../errors/AdminError';
import SessionError from '../errors/SessionError';
import { CompleteMultipartUploadCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function checkSession(onlyAdmin: boolean = false) {
    const session = await getServerSession(authOptions);

    if (!session) throw new SessionError();
    if (onlyAdmin && session.user.role !== 'admin') throw new AdminError();

    return session;
}

export function revalidateProductPaths(ean: string) {
    revalidatePath(`/product/${ean}`, 'page');
    revalidatePath('/my-list', 'page');
    revalidatePath('/product-verification', 'page');
    revalidatePath(`/product-verification/${ean}`, 'page');
}

export async function uploadFormImage(file: File, folder: string) {
        const s3Client = new S3Client({});

        const randomId = crypto.randomUUID();
        const fileName = `${file.name}-${randomId}`;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: `${folder}/${fileName}.jpg`,
                Body: file,
                ContentType: 'image/jpeg',
            },
        });

        const res =
            (await upload.done()) as CompleteMultipartUploadCommandOutput;

        return res.Location;
}
