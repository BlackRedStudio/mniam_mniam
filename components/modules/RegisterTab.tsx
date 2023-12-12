'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUserAction } from '@/server/actions/user-actions';
import { signIn } from 'next-auth/react';

import { useToast } from '@/lib/hooks/use-toast';
import { TRegistrationValidatorErrors } from '@/lib/validators/user-validator';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

import SignUpButton from '../ui/SignUpButton';
import { Icons } from './Icons';

function RegisterTab() {
    const { toast } = useToast();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] =
        useState<TRegistrationValidatorErrors>();

    const handleRegistration = async (formData: FormData) => {
        const res = await registerUserAction(formData);

        if (!res.success && res.errors) {
            setFormErrors(res.errors);
        }

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if (res.success === true) {
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
        <div>
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
                    {<FormError formErrors={formErrors?.email} />}
                </div>
                <div className="relative mb-4">
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="mt-1"
                        placeholder="Wpisz swoje hasło"
                        required
                    />
                    {<FormError formErrors={formErrors?.password} />}
                    {showPassword ? (
                        <Icons.eye
                            className="absolute bottom-[7px] right-[7px]"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <Icons.eyeOff
                            className="absolute bottom-[7px] right-[7px]"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
                <div className="relative mb-4">
                    <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="passwordConfirm"
                        className="mt-1"
                        placeholder="Wpisz ponownie swoje hasło"
                        required
                    />
                    {<FormError formErrors={formErrors?.passwordConfirm} />}
                    {showPassword ? (
                        <Icons.eye
                            className="absolute bottom-[7px] right-[7px]"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <Icons.eyeOff
                            className="absolute bottom-[7px] right-[7px]"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
                <SignUpButton title="Zarejestruj się" />
            </form>
        </div>
    );
}

export default RegisterTab;
