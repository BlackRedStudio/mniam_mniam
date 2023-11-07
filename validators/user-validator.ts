import { z } from 'zod';

export const userRegistrationValidator = z
    .object({
        name: z
            .string()
            .trim()
            .min(5, {
                message:
                    'Nazwa użytkownika musi zawierać przynajmniej 5 znaków',
            })
            .max(128, {
                message: 'Nazwa użytkownika może mieć max 128 znaków',
            }),
        email: z
            .string()
            .trim()
            .email({
                message: 'Nieprawidłowy adres Email',
            })
            .min(5, {
                message: 'Email musi mieć przynajmniej 5 liter',
            })
            .max(128, {
                message: 'Email może mieć max 128 znaków',
            }),
        password: z
            .string()
            .trim()
            .min(8, {
                message: 'Hasło powinno mieć co najmniej 8 znaków',
            })
            .max(128, {
                message: 'Hasło może mieć max 128 znaków',
            })
            .regex(/.*[0-9].*/, {
                message: 'Hasło musi zawierać przynajmniej jedną cyfrę',
            })
            .regex(/.*[!@#$%^&*].*/, {
                message:
                    'Hasło musi zawierać przynajmniej jeden ze specjalnych znaków: !@#$%^&*',
            }),
        passwordConfirm: z.string().trim(),
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: 'Hasła nie pasują do siebie',
        path: ['passwordConfirm'],
    });

export type TUserRegistrationValidator = z.infer<typeof userRegistrationValidator>;
