import { redirect } from 'next/navigation';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

function middleware(req: NextRequestWithAuth) {
    if (
        req.nextUrl.pathname.startsWith('/product-verification') &&
        req.nextauth.token?.role !== 'admin'
    ) {
        redirect('/');

        // show page 'access-denied' in current URL
        // return NextResponse.rewrite(
        //     new URL('/access-denied', req.url)
        // )
    }
}

export default withAuth(middleware, {
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export const config = {
    matcher: [
        '/dashboard',
        '/profile',
        '/my-list',
        '/product-verification',
        '/product',
        '/product/(.*)',
    ],
};
