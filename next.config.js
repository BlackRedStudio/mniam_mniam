const runtimeCaching = require('@imbios/next-pwa/cache.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // images: {
    //     dangerouslyAllowSVG: true,
    //     remotePatterns: [
    //         {
    //             protocol: 'http',
    //             hostname: 'localhost',
    //             pathname: '/**',
    //         },
    //         {
    //             protocol: 'http',
    //             hostname: '185.72.198.19',
    //             pathname: '/**',
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: 'laravel.xafy.app',
    //             pathname: '/**',
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: 'placehold.co',
    //             pathname: '/**',
    //         },
    //     ],
    // },
};

const withPWA = require('@imbios/next-pwa')({
    dest: 'public',
    runtimeCaching,
    buildExcludes: [/app-build-manifest\.json$/]
});

module.exports = withPWA(nextConfig);
