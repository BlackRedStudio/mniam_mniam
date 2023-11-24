import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

import bcrypt from 'bcrypt';
import { TUserInsert } from '../schemas';
import UserRepository from '../repositories/UserRepository';

class UserService {

    static async uploadAvatar(file: File) {
        const s3Client = new S3Client({});

        const avatarId = crypto.randomUUID();
        const avatarFileName = `${file.name}-${avatarId}`;

        const fileCropped = await sharp(await file.arrayBuffer())
            .resize({
                width: 50,
                height: 50,
            })
            .toBuffer();

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: `avatars/${avatarFileName}.jpg`,
                Body: fileCropped,
                ContentType: 'image/jpeg',
            },
        });

        const res =
            (await upload.done()) as CompleteMultipartUploadCommandOutput;

        return res.Location;
    }

    static async updateProfile(
        userId: string,
        name: string,
        email: string,
        password?: string,
        image?: File,
    ) {
        const userValues: Omit<TUserInsert, 'id'> = {
            name,
            email,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userValues.password = hashedPassword;
        }
        if (image) {
            const avatarUrl = await this.uploadAvatar(image);

            if (avatarUrl) {
                userValues.image = avatarUrl;
            }
        }

        await UserRepository.update(userId, userValues);

        return {
            name,
            email,
            image: userValues.image,
        };
    }
}

export default UserService;
