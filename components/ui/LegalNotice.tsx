function LegalNotice() {
    return (
        <div className="mb-4 text-xs">
            Dodając informacje, dane i/lub obrazy, wyrażasz zgodę na
            nieodwołalne umieszczenie swojego wkładu w ramach licencji{' '}
            <a
                className="text-orange"
                href="https://opendatacommons.org/licenses/dbcl/1-0/"
                target="_blank"
            >
                Database Contents License 1.0
            </a>{' '}
            w przypadku informacji i danych oraz w ramach licencji{' '}
            <a
                className="text-orange"
                href="https://creativecommons.org/publicdomain/zero/1.0/deed.pl"
                target="_blank"
            >
                Creative Commons 0
            </a>{' '}
            na przesyłane obrazy.
        </div>
    );
}

export default LegalNotice;
