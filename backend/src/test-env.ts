import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env['NODE_ENV'] === 'production' ? '.env.production' : '.env.development';
const envPath = path.join(__dirname, '..', envFile);

console.log('Environment:', process.env['NODE_ENV'] || 'undefined');
console.log('Loading env file from:', envPath);

dotenv.config({ path: envPath });

console.log('\n--- Environment Variables ---');
console.log('DB_HOST:', process.env['DB_HOST']);
console.log('DB_PORT:', process.env['DB_PORT']);
console.log('DB_USER:', process.env['DB_USER']);
console.log('DB_NAME:', process.env['DB_NAME']);
console.log('DB_PASSWORD:', process.env['DB_PASSWORD'] ? '[HIDDEN]' : 'undefined');

// Test Sequelize connection
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env['DB_NAME'] as string, 
    process.env['DB_USER'] as string, 
    process.env['DB_PASSWORD'] as string, {
        host: process.env['DB_HOST'] as string,
        port: parseInt(process.env['DB_PORT'] as string),
        dialect: 'mysql',
        logging: console.log, // Enable logging to see what's happening
    }
);

console.log('\n--- Testing Sequelize Connection ---');
sequelize.authenticate()
    .then(() => {
        console.log('✅ Sequelize connection has been established successfully.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Unable to connect to the database:', err);
        process.exit(1);
    });
