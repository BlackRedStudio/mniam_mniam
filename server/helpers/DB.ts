import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../schemas';

// Singleton function to ensure only one db instance is created
async function singleton<Value>(
    name: string,
    value: () => Value,
): Promise<Value> {
    const globalAny: any = global;
    globalAny.__singletons = globalAny.__singletons || {};

    if (!globalAny.__singletons[name]) {
        globalAny.__singletons[name] = await value();
    }

    return globalAny.__singletons[name];
}

// Function to create the database connection and apply migrations if needed
async function createDatabaseConnection() {
    const client = createClient({
        url: process.env.TURSO_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    return drizzle(client, { schema });
}

const DB = await singleton('DB', createDatabaseConnection);

export { DB, schema };
