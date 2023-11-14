import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.blackredstudio.mniap_app',
    appName: 'mniam_mniam',
    webDir: '.next',
    server: {
        cleartext: true,
        androidScheme: 'http',
        url: 'https://mniam-mniam.vercel.app/',
    },
};

export default config;
