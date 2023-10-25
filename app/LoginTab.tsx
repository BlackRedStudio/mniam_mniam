'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export type loginType = 'credentials' | 'google' | 'github';

function LoginTab() {
    const { toast } = useToast();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (type: loginType) => {
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
        <div className="login-tab">
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
            <div>
                <Label htmlFor="password">Hasło</Label>
                <Input
                    type="password"
                    name="password"
                    className="mt-1"
                    placeholder="Wpisz swoje hasło"
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <Button
                className="mt-6 py-7 w-full"
                disabled={loading}
                onClick={() => handleLogin('credentials')}>
                Zaloguj się
            </Button>
            <Separator className="my-8" />
            <Button
                className="py-7 w-full bg-white text-primary border-2 mb-6"
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
                className="py-7 w-full border-2 mb-6"
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
