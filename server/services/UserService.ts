import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';

import { DB } from '../helpers/DB';
import { usersTable } from '../schema';

type TFieldsToUpdate = {
    name: string;
    email: string;
    password?: string;
    image?: string;
};

class UserService {
    static async insert(email: string, name: string, password: string) {
        const id = crypto.randomUUID();

        const hashedPassword = await bcrypt.hash(password, 10);

        // user not exist before
        await DB.insert(usersTable).values({
            id,
            name,
            email,
            password: hashedPassword,
        });
    }

    static async findFirstByEmail(email: string) {
        const user = await DB.query.usersTable.findFirst({
            where: eq(usersTable.email, email),
            with: {
                accounts: true,
            },
        });

        return user;
    }

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

    static async deleteAvatar(userId: string) {
        await DB.update(usersTable)
            .set({
                image: null,
            })
            .where(eq(usersTable.id, userId));
    }

    static async updateProfile(
        userId: string,
        name: string,
        email: string,
        password?: string,
        image?: File,
    ) {
        const fieldsToUpdate: TFieldsToUpdate = {
            name,
            email,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fieldsToUpdate.password = hashedPassword;
        }
        if (image) {
            const avatarUrl = await this.uploadAvatar(image);

            if (avatarUrl) {
                fieldsToUpdate.image = avatarUrl;
            }
        }

        await DB.update(usersTable)
            .set(fieldsToUpdate)
            .where(eq(usersTable.id, userId));

        return {
            name,
            email,
            image: fieldsToUpdate.image,
        };
    }
}

export default UserService;
