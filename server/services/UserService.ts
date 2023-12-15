import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

import bcrypt from 'bcrypt';
import { TUserInsert } from '../schemas';
import UserRepository, { TAllWithRankingInfoReturn } from '../repositories/UserRepository';
import { TUserRankingCounter } from '@/types/types';

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

    static async prepareUsersCounters(users: TAllWithRankingInfoReturn): Promise<TUserRankingCounter[]> {

        const usersWithCounters = users.map(user => {
            let firstRateCount = 0;
            let propsAddedCount = 0;
            let imgUploadedCount = 0;
            let mniamPoints = 0;

            user.userProducts.forEach(userProduct => {
                let mniamPoint = 1;

                if(userProduct.firstRate) {
                    firstRateCount++;
                    mniamPoint++;
                }
                if(userProduct.propsAdded) {
                    propsAddedCount++;
                    // for people how added attributes it will be +5 extra points
                    mniamPoint += 3;
                }
                if(userProduct.imgUploaded) {
                    imgUploadedCount++;
                    // for people how uploaded photos it will be +7 extra points
                    mniamPoint += 2;
                }

                mniamPoints += mniamPoint;
            });

            return {
                name: user.name,
                image: user.image,
                mniamPoints,
                totalProductsRateCount: user.userProducts.length,
                firstRateCount,
                propsAddedCount,
                imgUploadedCount,
            }
        });
        
        return usersWithCounters.filter(user => user.mniamPoints > 0 && user.name);
    }
}

export default UserService;
