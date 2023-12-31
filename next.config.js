/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.openfoodfacts.net',
                pathname: '/images/products/**',
            },
            {
                protocol: 'https',
                hostname: 'images.openfoodfacts.org',
                pathname: '/images/products/**',
            },
            {
                protocol: 'https',
                hostname: 'mniam-app.s3.eu-central-1.amazonaws.com',
                pathname: '/**',
            },
            // {
            //     protocol: 'http',
            //     hostname: '185.72.198.19',
            //     pathname: '/**',
            // },
            // {
            //     protocol: 'https',
            //     hostname: 'laravel.xafy.app',
            //     pathname: '/**',
            // },
            // {
            //     protocol: 'https',
            //     hostname: 'placehold.co',
            //     pathname: '/**',
            // },
        ],
    },
};

module.exports = nextConfig;
