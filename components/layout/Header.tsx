import { Session } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Logo from './Logo';
import Link from 'next/link';
import Menu from './Menu';
import { getNameInitials } from '@/lib/utils';

type THeader = {
    session: Session;
};

function Header({ session }: THeader) {

    const nameInitials = session.user?.name ? getNameInitials(session.user.name) : 'MM';

    return (
        <header className="py-4 px-2 border-b-2 flex items-center justify-between">
            <Avatar>
                {
                    session.user?.image ?
                    <AvatarImage src={session.user.image} /> :
                    null
                }
                <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <Link href="/dashboard">
                <Logo />
            </Link>
            <Menu />
        </header>
    );
}

export default Header;
