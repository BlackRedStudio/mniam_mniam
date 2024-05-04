import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import H2 from '@/components/ui/H2';
import H3 from '@/components/ui/H3';
import { ScrollArea } from '@/components/ui/ScrollArea';
import Logo from '@/components/layout/Logo';

async function privacyPolicyPage() {
    return (
        <ScrollArea className="h-[100vh]">
            <main className="flex min-h-screen flex-col items-center justify-start p-4">
                <div className="mb-7">
                    <Logo />
                </div>
                <H2 className="mb-3">Polityka prywatności</H2>
                <H3>
                    Informacje o administratorze i przetwarzaniu danych
                    osobowych
                </H3>
                <ol className="list-decimal">
                    <li>
                        Administratorem danych osobowych jest firma Black Red
                        Studio, z siedzibą pod adresem ul. Trześniowska 61,
                        20-227 Lublin, Numer NIP: 9462688751, REGON: 383255424.
                    </li>
                    <li>
                        Dane osobowe ulegające przetwarzaniu: Nazwa użytkownika,
                        Adres e-mail.
                    </li>
                    <li>
                        Dane osobowe będą przetwarzane na podstawie art. 6 ust.
                        1 lit. a RODO w celu uwierzytelnienia użytkownika, oraz
                        korzystania z funkcjonalności aplikacji.
                    </li>
                    <li>
                        Podanie danych osobowych jest dobrowolne, jednak ich
                        brak uniemożliwia świadczenie w/w usługi.
                    </li>
                    <li>
                        Kontakt z Administratorem w sprawach związanych z
                        przetwarzaniem oraz ochroną danych osobowych jest
                        możliwy drogą elektroniczną pod adresem e-mail:
                        team@blackredstudio.com.
                    </li>
                    <li>
                        Przysługuje Panu/Pani prawo żądania dostępu do treści
                        danych osobowych, ich sprostowania, usunięcia oraz
                        ograniczenia ich przetwarzania. Ponadto także prawo do
                        cofnięcia zgody w dowolnym momencie bez wpływu na
                        zgodność z prawem przetwarzania, prawo do przenoszenia
                        danych oraz prawo do wniesienia sprzeciwu wobec
                        przetwarzania danych osobowych, aby skorzystać z tych
                        praw należy skontaktować się z administratorem danych
                        osobowych kontakt w punkcie 5).
                    </li>
                    <li>
                        Posiada Pan/Pani prawo wniesienia skargi do Prezesa
                        Urzędu Ochrony Danych Osobowych.
                    </li>
                    <li>
                        Usługodawca ma prawo udostępniać dane osobowe
                        Użytkownika oraz innych jego danych podmiotom
                        upoważnionym na podstawie właściwych przepisów prawa
                        (np. organom ścigania).
                    </li>
                    <li>
                        Usunięcie danych osobowych może nastąpić na skutek
                        cofnięcia zgody bądź wniesienia prawnie dopuszczalnego
                        sprzeciwu na przetwarzanie danych osobowych.
                    </li>
                    <li>
                        Dane osobowe będą przechowywane przez okres roku od daty
                        wysłania zapytania.
                    </li>
                    <li>
                        Pani/Pana dane osobowe nie będą przekazywane żadnym
                        odbiorcom danych.
                    </li>
                </ol>
                <br />
                <H3>Informacje o plikach cookies</H3>
                <ol className="list-decimal">
                    <li>
                        Administratorem serwisu pod domeną
                        mniam-mniam.vercel.app jest firma Black Red Studio, z
                        siedzibą pod adresem ul. Trześniowska 61, 20-227 Lublin,
                        Numer NIP: 9462688751, REGON: 383255424.
                    </li>
                    <li>
                        Serwis zbiera w sposób automatyczny tylko informacje
                        zawarte w plikach cookies.
                    </li>
                    <li>
                        Serwis wykorzystuje pliki cookies tzw. „ciasteczka”,
                        które stanowią dane informatyczne, w szczególności pliki
                        tekstowe, które przechowywane są w urządzeniu końcowym
                        użytkownika i przeznaczone są do korzystania ze stron
                        internetowych serwisu. Pliki cookies przede wszystkim
                        zawierają nazwę strony internetowej, z której pochodzą,
                        czas przechowywania ich na urządzeniu końcowym oraz
                        unikalny numer. Podmiotem zamieszczającym na urządzeniu
                        końcowym użytkownika pliki cookies oraz uzyskującym do
                        nich dostęp jest Administrator.
                    </li>
                    <li>
                        Na naszej witrynie wykorzystujemy następujące pliki
                        cookies:
                    </li>
                </ol>
                <ul className="list-disc pl-4">
                    <li>
                        „niezbędne” pliki cookies, umożliwiające korzystanie z
                        usług dostępnych w ramach serwisu, np. uwierzytelniające
                        pliki cookies wykorzystywane do usług wymagających
                        uwierzytelniania w ramach serwisu;
                    </li>
                    <li>
                        pliki cookies służące do zapewnienia bezpieczeństwa, np.
                        wykorzystywane do wykrywania nadużyć w zakresie
                        uwierzytelniania w ramach serwisu;
                    </li>
                    <li>
                        „wydajnościowe” pliki cookies, umożliwiające zbieranie
                        informacji o sposobie korzystania ze stron internetowych
                        serwisu;
                    </li>
                    <li>
                        „funkcjonalne” pliki cookies, umożliwiające
                        „zapamiętanie” wybranych przez użytkownika ustawień i
                        personalizację interfejsu użytkownika, np. w zakresie
                        wybranego języka lub regionu, z którego pochodzi
                        użytkownik, rozmiaru czcionki, wyglądu strony
                        internetowej itp.;
                    </li>
                </ul>
                <ol start={5} className="list-decimal">
                    <li>
                        Serwis stosuje dwa zasadnicze rodzaje plików (cookies) –
                        sesyjne i stałe. Pliki sesyjne są tymczasowe,
                        przechowuje się je do momentu opuszczenia strony serwisu
                        (poprzez wejście na inną stronę, wylogowanie lub
                        wyłączenie przeglądarki). Pliki stałe przechowywane są w
                        urządzeniu końcowym użytkownika do czasu ich usunięcia
                        przez użytkownika lub przez czas wynikający z ich
                        ustawień.
                    </li>
                    <li>
                        Użytkownik może w każdej chwili dokonać zmiany ustawień
                        swojej przeglądarki, aby zablokować obsługę plików
                        (cookies) lub każdorazowo uzyskiwać informacje o ich
                        umieszczeniu w swoim urządzeniu. Inne dostępne opcje
                        można sprawdzić w ustawieniach swojej przeglądarki
                        internetowej. Należy pamiętać, że większość przeglądarek
                        domyślnie jest ustawione na akceptację zapisu plików
                        (cookies) w urządzeniu końcowym.
                    </li>
                    <li>
                        Administrator informuje, że zmiany ustawień w
                        przeglądarce internetowej użytkownika mogą ograniczyć
                        dostęp do niektórych funkcji strony internetowej
                        serwisu.
                    </li>
                    <li>
                        Pliki cookies zamieszczane w urządzeniu końcowym
                        Użytkownika Serwisu i wykorzystywane mogą być również
                        przez współpracujących z operatorem Serwisu
                        reklamodawców oraz partnerów.
                    </li>
                    <li>
                        Administrator korzysta z usługi Google Analytics która
                        rejestruje zachowanie użytkownika na stronie w celu
                        usprawnienia funkcjonowania serwisu, przesyłane dane są
                        anonimowe, aby uniknąć zbierania danych przez Google
                        Analytics należy pobrać i zainstalować wtyczkę Kliknij.
                    </li>
                    <li>
                        Więcej informacji na temat plików cookies dostępnych
                        jest w sekcji „Pomoc” w menu przeglądarki internetowej
                        lub na stronie jej producenta.
                    </li>
                </ol>
                <Link href="/delete-account">
                    <Button className="mt-5">Usuwanie konta</Button>
                </Link>
            </main>
        </ScrollArea>
    );
}

export default privacyPolicyPage;
