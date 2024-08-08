import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
    path: '.env.local',
});

export default {
    schema: './server/schemas/*.ts',
    out: './drizzle',
    driver: 'turso',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.TURSO_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
} satisfies Config;
