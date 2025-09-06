const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.development' });

async function testMySQLConnection() {
    try {
        console.log('Attempting to connect to MySQL...');
        console.log(`Host: ${process.env.DB_HOST}`);
        console.log(`Port: ${process.env.DB_PORT}`);
        console.log(`User: ${process.env.DB_USER}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 10000,
        });
        
        console.log('✅ MySQL connection successful!');
        
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query test successful:', rows);
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error errno:', error.errno);
        console.error('Error sqlState:', error.sqlState);
    }
}

testMySQLConnection();
