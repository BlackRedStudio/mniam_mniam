import Logo from './Logo';
import Link from 'next/link';
import Menu from './Menu';
import AvatarElement from './Avatar';

function Header() {

    return (
        <header className="py-4 px-2 border-b-2 flex items-center justify-between">
            <AvatarElement />
            <Link href="/dashboard">
                <Logo />
            </Link>
            <Menu />
        </header>
    );
}

export default Header;
