'use server';

import { users } from '@/schema/users';
import {
    userProfileValidator,
    userRegistrationValidator,
} from '@/validators/user-validator';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { db } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

type TFieldsToUpdate = {
    name: string,
    email: string,
    password?: string;
    avatar?: File;
}

export async function updateProfile(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error();


        const parsed = userProfileValidator.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
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
                message:
                    'Wykryto pusty adres Email',
            };
        }
        if (!parsed.data?.name) {
            return {
                success: false,
                message:
                    'Wykryto pustą nazwę',
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
        }

        if(parsed.data.password) {
            const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
            fieldsToUpdate.password = hashedPassword;
        }

        await db
            .update(users)
            .set(fieldsToUpdate)
            .where(eq(users.id, session.user.id));

        return { success: true, message: 'Zmiany w profilu zostały zapisane' };
    } catch (e) {
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
