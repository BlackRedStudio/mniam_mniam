'use server';

import bcrypt from 'bcrypt'

import { eq } from 'drizzle-orm';

import { users } from '@/models/user';
import { userRegistrationSchema } from '@/validation/user-validation';
import { db } from '@/lib/db';

export type TRegisterUserReturn = Awaited<ReturnType<typeof registerUser>>;

export async function registerUser(formData: FormData) {
    try {
        const id = crypto.randomUUID();

        const parsed = userRegistrationSchema.safeParse({
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
            }
        });

        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

        // user and password exist
        if (existingUser && existingUser.password !== null) {
            return {
                success: false,
                message:
                    'Użytkownik z danym adresem email już istnieje w bazie danych',
            };
        } else if (existingUser) {
            // user exist but without password, user was created by OAuth
            await db.update(users).set({
                name: parsed.data.name,
                password: hashedPassword
            }).where(eq(users.id, existingUser.id))

            return {
                success: true,
                message:
                    'Wykryliśmy że logowałeś się poprzednio z podanym adresem Email przez Google lub Github, nazwa użytkownika oraz hasło zostały zapisane',
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
        console.log(e);
        return {
            success: false,
            message: 'Błąd aplikacji skontaktuj się z administratorem',
        };
    }
}
