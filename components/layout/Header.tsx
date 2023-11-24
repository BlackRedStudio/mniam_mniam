import Link from 'next/link';

import AvatarElement from './Avatar';
import Logo from './Logo';
import Menu from './Menu';

function Header() {
    return (
        <header className="flex items-center justify-between border-b-2 px-2 py-4">
            <AvatarElement />
            <Link href="/dashboard">
                <Logo />
            </Link>
            <Menu />
        </header>
    );
}

export default Header;
