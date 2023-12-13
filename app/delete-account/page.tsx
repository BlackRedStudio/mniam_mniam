import H2 from '@/components/ui/H2';
import H3 from '@/components/ui/H3';
import { ScrollArea } from '@/components/ui/ScrollArea';
import Logo from '@/components/layout/Logo';

async function deleteAccountPage() {
    return (
        <ScrollArea className="h-[100vh]">
            <main className="flex min-h-screen flex-col items-center justify-start p-4">
                <div className="mb-7">
                    <Logo />
                </div>
                <H2 className="mb-3">Usuwanie konta</H2>
                <H3>
                    Jeżeli chcesz usunąć konto z aplikacji{' '}
                    <strong>Mniam App</strong> wystarczy że wyślesz wiadomość z
                    adresu Email z którego zarejestrowałeś się w aplikacji na
                    adres{' '}
                    <a
                        href="mailto:team@blackredstudio.com"
                        className="text-orange">
                        team@blackredstudio.com
                    </a>{' '}
                    zawierającą frazę,{' '}
                    <strong>
                        proszę o usunięcie mojego konta z aplikacji Mniam App
                    </strong>{' '}
                    lub podobną. Wszystkie Twoje dane oraz lista produktów
                    i ich oceny zostaną usunięte w ciągu najbliższych 5 dni
                    roboczych.
                    <br />
                    <br />
                    Kasowanie konta możesz odwołać w dowolnym momencie o ile
                    jeszcze nie doszło do jego kasacji, wtedy należy wysłać na
                    podany wcześniej adres email wiadomość z frazą:{' '}
                    <strong>
                        proszę jednak o nie usuwanie mojego konta z aplikacji
                        Mniam App
                    </strong>{' '}
                    lub podobną.
                </H3>
            </main>
        </ScrollArea>
    );
}

export default deleteAccountPage;
