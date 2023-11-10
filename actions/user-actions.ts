'use server';

import { users } from '@/schema/users';
import {
    userProfileValidator,
    userRegistrationValidator,
} from '@/validators/user-validator';
import {
    CompleteMultipartUploadCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import sharp from 'sharp';

import { db } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export type TRegisterUserReturn = Awaited<ReturnType<typeof registerUser>>;

export async function registerUser(formData: FormData) {
    try {
        const id = crypto.randomUUID();

        const parsed = userRegistrationValidator.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            passwordConfirm: formData.get('passwordConfirm'),
        });

        // validation Error
        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, parsed.data.email),
            with: {
                accounts: true,
            },
        });

        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

        // user and password exist
        if (existingUser) {
            return {
                success: false,
                message:
                    'Użytkownik z danym adresem email już istnieje w bazie danych',
            };
        }

        // user not exist before
        await db.insert(users).values({
            id,
            name: parsed.data.name,
            email: parsed.data.email,
            password: hashedPassword,
        });
        return { success: true, message: 'Rejestracja przebiegła pomyślnie' };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

async function uploadAvatar(file: File) {
    try {
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

        return {
            success: true,
            uploadedImage: res,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

type TFieldsToUpdate = {
    name: string;
    email: string;
    password?: string;
    image?: string;
};

export type TProfileUserReturn = Awaited<ReturnType<typeof updateProfile>>;

export async function updateProfile(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();
        const avatarFile = formData.get('avatar') as File;

        const parsed = userProfileValidator.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            image:
                !avatarFile || avatarFile.name !== 'undefined'
                    ? avatarFile
                    : undefined,
            password: formData.get('password') || undefined,
            passwordConfirm: formData.get('passwordConfirm') || undefined,
        });

        // validation Error
        if (!parsed.success) {
            return {
                success: false,
                message:
                    'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie',
                errors: parsed.error.formErrors.fieldErrors,
            };
        }

        if (!parsed.data.email) {
            return {
                success: false,
                message: 'Wykryto pusty adres Email',
            };
        }
        if (!parsed.data?.name) {
            return {
                success: false,
                message: 'Wykryto pustą nazwę',
            };
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, parsed.data.email),
        });

        // if user email has changed
        if (existingUser && session.user.email !== parsed.data.email) {
            return {
                success: false,
                message:
                    'Użytkownik z danym adresem email już istnieje w bazie danych',
            };
        }

        const fieldsToUpdate: TFieldsToUpdate = {
            name: parsed.data.name,
            email: parsed.data.email,
        };

        if (parsed.data.password) {
            const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
            fieldsToUpdate.password = hashedPassword;
        }
        if (parsed.data.image) {
            const uploadRes = await uploadAvatar(parsed.data.image);

            if (uploadRes.success && uploadRes.uploadedImage?.Location) {
                fieldsToUpdate.image = uploadRes.uploadedImage.Location;
            }
        }

        await db
            .update(users)
            .set(fieldsToUpdate)
            .where(eq(users.id, session.user.id));

        revalidatePath('/profile');

        return {
            success: true,
            message: 'Zmiany w profilu zostały zapisane',
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                image: fieldsToUpdate.image,
            },
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}

export async function deleteAvatar() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();

        await db
            .update(users)
            .set({
                'image': null
            })
            .where(eq(users.id, session.user.id));

        revalidatePath('/profile');

        return {
            success: true,
            message: 'Avatar został usunięty',
        };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
