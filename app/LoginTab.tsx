'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function LoginTab() {

    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            <div className="">
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
                className="mt-2"
                disabled={loading}
                onClick={async () => {
                    setLoading(true);
                    const res = await signIn('credentials', {
                        email,
                        password,
                        redirect: false,
                        callbackUrl: '/',
                    });
                    if(res?.error) {
                        toast({
                            title: 'Nie poprawne dane, spróbuj jeszcze raz lub skontaktuj się z Administratorem',
                            variant: 'destructive',
                        });
                    } else {
                        toast({
                            title: 'Zalogowano pomyślnie',
                            variant: 'success',
                        });
                    }
                    setLoading(false);
                }}>
                Zaloguj się
            </Button>
        </div>
    );
}

export default LoginTab;
