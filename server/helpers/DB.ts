import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from '../schemas';

// create the connection
const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_USERNAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});
export const DB = drizzle(connection, { schema, mode: 'default' });
