import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginTab from './LoginTab';

export default async function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className='w-full mb-10'>
                    <TabsTrigger className='w-1/2' value="login">Logowanie</TabsTrigger>
                    <TabsTrigger className='w-1/2' value="register">Rejestracja</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginTab />
                </TabsContent>
                <TabsContent value="register">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </main>
    );
}
