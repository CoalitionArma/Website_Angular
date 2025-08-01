import { Sequelize } from 'sequelize';

// Load environment variables from .env file
import dotenv from 'dotenv';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: envFile });

const sequelize = new Sequelize(process.env['DB_NAME'] as string, process.env['DB_USER'] as string, process.env['DB_PASSWORD'] as string, {
    host: process.env['DB_HOST'] as string,
    port: parseInt(process.env['DB_PORT'] as string),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;