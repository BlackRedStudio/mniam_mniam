import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import AdminError from '../errors/AdminError';
import SessionError from '../errors/SessionError';

export async function checkSession(onlyAdmin: boolean = false) {
    const session = await getServerSession(authOptions);

    if (!session) throw new SessionError();
    if (onlyAdmin && session.user.role !== 'admin') throw new AdminError();

    return session;
}

export function revalidateProductPaths(ean: string) {
    revalidatePath(`/product/${ean}`, 'page');
    revalidatePath('/my-list', 'page');
    revalidatePath('/product-verification', 'page');
    revalidatePath(`/product-verification/${ean}`, 'page');
}
