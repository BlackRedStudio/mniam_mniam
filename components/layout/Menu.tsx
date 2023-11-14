'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/modules/Icons';
import { App as CapacitorApp } from '@capacitor/app';

import AlertModal from '../modules/Modal';
import { useEffect, useState } from 'react';

const checkAppLaunchUrl = async () => {
    await CapacitorApp.exitApp();
  };

function Menu() {
    const { toast } = useToast();
    const router = useRouter();
    const [test, setTest] = useState(null);

    useEffect(() => {
        CapacitorApp.addListener('backButton', ({canGoBack}) => {
            console.log('asdasdasd');
            if(!canGoBack){
              CapacitorApp.exitApp();
            } else {
              window.history.back();
            }
          });

          CapacitorApp.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
          });
          
          CapacitorApp.addListener('appUrlOpen', data => {
            console.log('App opened with URL:', data);
          });
          
          CapacitorApp.addListener('appRestoredResult', data => {
            console.log('Restored state:', data);
          });
          

    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="pointer-events-auto">
                <Icons.menu className="h-9 w-9 stroke-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32 mr-4">
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
                    <DropdownMenuItem onClick={checkAppLaunchUrl}>Test</DropdownMenuItem>
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
                    }}>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                        Wyloguj się
                    </DropdownMenuItem>
                </AlertModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Menu;
