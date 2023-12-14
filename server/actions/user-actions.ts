'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

import {
    userProfileValidator,
    userRegistrationValidator,
} from '@/lib/validators/user-validator';

import CriticalError from '../errors/CriticalError';
import Error from '../errors/Error';
import ParsedError from '../errors/ParsedError';
import { checkSession } from '../helpers/helpers';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

export async function registerUserAction(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const passwordConfirm = formData.get('passwordConfirm') as string;

        const parsed = userRegistrationValidator.safeParse({
            name,
            email,
            password,
            passwordConfirm,
        });

        // validation Error
        if (!parsed.success) {
            return { ...new ParsedError(parsed.error.formErrors.fieldErrors) };
        }

        const user = await UserRepository.firstWithAccounts({ email });

        // user and password exist
        if (user) {
            return {
                ...new Error(
                    'Użytkownik z danym adresem email już istnieje w bazie danych',
                ),
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserRepository.insert(email, name, hashedPassword);

        return {
            success: true as const,
            message: 'Rejestracja przebiegła pomyślnie',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}

export async function updateProfileAction(formData: FormData) {
    try {
        const session = await checkSession();

        const avatarFile = formData.get('avatar') as File;
        const image =
            !avatarFile || avatarFile.name !== 'undefined'
                ? avatarFile
                : undefined;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = (formData.get('password') as string) || undefined;
        const passwordConfirm =
            (formData.get('passwordConfirm') as string) || undefined;

        const parsed = userProfileValidator.safeParse({
            name,
            email,
            image,
            password,
            passwordConfirm,
        });

        // validation Error
        if (!parsed.success) {
            return { ...new ParsedError(parsed.error.formErrors.fieldErrors) };
        }

        const user = await UserRepository.firstWithAccounts({ email });

        // if user email has changed
        if (user && session.user.email !== email) {
            return {
                ...new Error(
                    'Użytkownik z danym adresem email już istnieje w bazie danych',
                ),
            };
        }

        const data = await UserService.updateProfile(
            session.user.id,
            name,
            email,
            password,
            image,
        );

        revalidatePath('/profile');

        return {
            success: true as const,
            message: 'Zmiany w profilu zostały zapisane',
            data,
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}

export async function deleteAvatarAction() {
    try {
        const session = await checkSession();

        await UserRepository.deleteAvatar(session.user.id);

        revalidatePath('/profile');

        return {
            success: true as const,
            message: 'Avatar został usunięty',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}

export async function switchDarkModeAction() {
    try {
        const session = await checkSession();
        const darkMode = !session.user.darkMode;

        await UserRepository.update(session.user.id, { darkMode });

        revalidatePath('/');

        return {
            success: true as const,
            message: 'Tryb ciemny został przełączony',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}

export async function switchCamera__Action(camera: string) {
    try {
        const session = await checkSession();

        await UserRepository.update(session.user.id, { camera });

        revalidatePath('/');

        return {
            success: true as const,
            message: 'Kamera została zapisana poprawnie.',
        };
    } catch (e) {
        return { ...new CriticalError(e) };
    }
}
