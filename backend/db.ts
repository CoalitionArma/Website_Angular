import { Sequelize } from 'sequelize';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env['DB_NAME'] as string, process.env['DB_USER'] as string, process.env['DB_PASSWORD'] as string, {
    host: process.env['NETWORK_HOST'] as string,
    port: parseInt(process.env['DB_PORT'] as string),
    dialect: 'mysql',
    logging: false,
});

export default sequelize;