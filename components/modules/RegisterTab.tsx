'use client';

import { useState } from 'react';
import { registerUserAction } from '@/server/actions/user-actions';

import { useToast } from '@/lib/hooks/use-toast';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SignUpButton from '../ui/SignUpButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ParsedError from '@/server/errors/ParsedError';
import { TRegistrationValidatorErrors } from '@/lib/validators/user-validator';

function RegisterTab() {
    const { toast } = useToast();
    const router = useRouter();

    const [formErrors, setFormErrors] =
        useState<TRegistrationValidatorErrors>();

    const handleRegistration = async (formData: FormData) => {
        const res = await registerUserAction(formData);

        if(res instanceof ParsedError) {
            setFormErrors(res.errors);
        }

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if(res.success === true) {
            const resLogin = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false,
            });

            if (resLogin?.error) {
                toast({
                    title: 'Nie poprawne dane, spróbuj jeszcze raz lub skontaktuj się z Administratorem',
                    variant: 'destructive',
                });
            } else {
                router.push('/dashboard');
            }
        }
    };

    return (
        <div className="register-tab">
            <form action={formData => handleRegistration(formData)}>
                <div className="mb-4">
                    <Label htmlFor="name">Nazwa użytkownika</Label>
                    <Input
                        type="text"
                        name="name"
                        className="mt-1"
                        placeholder="Wpisz swoje imię oraz nazwisko"
                        required
                    />
                    {<FormError formErrors={formErrors?.name} />}
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        type="email"
                        name="email"
                        className="mt-1"
                        placeholder="Wpisz swój email"
                        required
                    />
                    {
                        <FormError
                            formErrors={formErrors?.email}
                        />
                    }
                </div>
                <div className="mb-4">
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                        type="password"
                        name="password"
                        className="mt-1"
                        placeholder="Wpisz swoje hasło"
                        required
                    />
                    {
                        <FormError
                            formErrors={formErrors?.password}
                        />
                    }
                </div>
                <div className="mb-4">
                    <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
                    <Input
                        type="password"
                        name="passwordConfirm"
                        className="mt-1"
                        placeholder="Wpisz ponownie swoje hasło"
                        required
                    />
                    {
                        <FormError
                            formErrors={
                                formErrors?.passwordConfirm
                            }
                        />
                    }
                </div>
                <SignUpButton title='Zarejestruj się' />
            </form>
        </div>
    );
}

export default RegisterTab;
