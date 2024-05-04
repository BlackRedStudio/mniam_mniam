'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { switchDarkModeAction } from '@/server/actions/user-actions';
import { App as CapacitorApp } from '@capacitor/app';
import { signOut, useSession } from 'next-auth/react';

import { useToast } from '@/lib/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Icons } from '@/components/modules/Icons';

import AlertModal from '../modules/AlertModal';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';

function Menu() {
    const { toast } = useToast();
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                CapacitorApp.exitApp();
            } else {
                window.history.back();
            }
        });
    }, []);

    useEffect(() => {
        if (session?.user.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [session?.user.darkMode]);

    const handleDarkMode = async () => {
        setLoading(true);
        try {
            if (!session?.user.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            await switchDarkModeAction();

            await update({
                darkMode: !session?.user.darkMode,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="pointer-events-auto">
                <Icons.menu className="h-9 w-9 stroke-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-54 mr-4">
                <DropdownMenuLabel>Menu główne</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
                <Link href="/profile">
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                </Link>
                <Link href="/my-list">
                    <DropdownMenuItem>Moja lista</DropdownMenuItem>
                </Link>
                <Link href="/list">
                    <DropdownMenuItem>Twoje ocenione produkty</DropdownMenuItem>
                </Link>
                <Link href="/ranking">
                    <DropdownMenuItem>Ranking</DropdownMenuItem>
                </Link>
                {session?.user.role === 'admin' && (
                    <Link href="/product-verification">
                        <DropdownMenuItem>
                            Weryfikacja produktów
                        </DropdownMenuItem>
                    </Link>
                )}
                <DropdownMenuItem>
                    <Label htmlFor="darkMode">Tryb ciemny</Label>
                    <Switch
                        onCheckedChange={handleDarkMode}
                        checked={session?.user.darkMode || false}
                        disabled={loading}
                        id="darkMode"
                        className="ml-3"
                    />
                </DropdownMenuItem>
                <Link href="/ticket">
                    <DropdownMenuItem>Zgłoś uwagę/pomysł</DropdownMenuItem>
                </Link>
                <AlertModal
                    title="Czy napewno chcesz się wylogować?"
                    accept={async () => {
                        const resSignOut = await signOut({
                            redirect: false,
                        });

                        if (resSignOut) {
                            router.push('/');

                            toast({
                                title: 'Wylogowano poprawnie',
                                variant: 'success',
                            });
                        }
                    }}
                >
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                        Wyloguj się
                    </DropdownMenuItem>
                </AlertModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Menu;
