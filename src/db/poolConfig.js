import {createPool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        waitForConnections: true,
       connectionLimit: 5,
       queueLimit: 0,
    });