import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ScrollArea } from '@/components/ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Logo from '@/components/layout/Logo';

import LoginTab from '../components/modules/LoginTab';
import RegisterTab from '../components/modules/RegisterTab';
import { authOptions } from './api/auth/[...nextauth]/route';

async function HomePage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/dashboard');
    }

    return (
        <ScrollArea className="h-[100vh]">
            <main className="flex min-h-screen flex-col items-center justify-start p-4">
                <div className="mb-5">
                    <Logo />
                </div>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="mb-5 w-full">
                        <TabsTrigger className="w-1/2" value="login">
                            Logowanie
                        </TabsTrigger>
                        <TabsTrigger className="w-1/2" value="register">
                            Rejestracja
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginTab />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterTab />
                    </TabsContent>
                </Tabs>
                <Link href="/privacy-policy" className='mt-6'>Polityka prywatności</Link>
            </main>
        </ScrollArea>
    );
}

export default HomePage;
