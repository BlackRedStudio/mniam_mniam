'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { TLogin } from '@/types/types';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';

import { Icons } from './Icons';

function LoginTab() {
    const { toast } = useToast();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (type: TLogin) => {
        setLoading(true);
        if (type === 'credentials') {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (res?.error) {
                toast({
                    title: 'Nie poprawne dane, spróbuj jeszcze raz lub skontaktuj się z Administratorem',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Zalogowano pomyślnie',
                    variant: 'success',
                });
                router.push('/dashboard');
            }
        } else {
            signIn(type, {
                callbackUrl: '/dashboard',
            });
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    name="email"
                    className="mt-1"
                    placeholder="Wpisz swój email"
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="relative">
                <Label htmlFor="password">Hasło</Label>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="mt-1"
                    placeholder="Wpisz swoje hasło"
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
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
            <Button
                className="mt-6 w-full py-7"
                disabled={loading}
                onClick={() => handleLogin('credentials')}>
                Zaloguj się
            </Button>
            <Separator className="my-8" />
            <Button
                className="mb-6 w-full border-2 bg-white py-7 text-primary"
                onClick={() => handleLogin('google')}>
                <img
                    loading="lazy"
                    height={24}
                    width={24}
                    className="mr-4"
                    id="provider-logo"
                    src="/google.svg"
                />
                Zaloguj się przez Google
            </Button>
            <Button
                className="mb-6 w-full border-2 py-7"
                onClick={() => handleLogin('github')}>
                <img
                    loading="lazy"
                    height={24}
                    width={24}
                    className="mr-4"
                    id="provider-logo"
                    src="/github.svg"
                />
                Zaloguj się przez Github
            </Button>
        </div>
    );
}

export default LoginTab;
