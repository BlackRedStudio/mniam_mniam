import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
    path: '.env.local',
});

export default {
    schema: './server/schemas/*.ts',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        host: process.env.DATABASE_HOST ?? '',
        database: process.env.DATABASE_USERNAME ?? '',
        user: process.env.DATABASE_USERNAME ?? '',
        password: process.env.DATABASE_PASSWORD ?? '',
    },
} satisfies Config;
