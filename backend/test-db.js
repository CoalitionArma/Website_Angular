const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing database connection...');
    console.log('Host:', '40.160.19.122');
    console.log('Port:', 3360);
    console.log('User:', 'coalitionweb');
    console.log('Database:', 'coalition');
    
    try {
        const connection = await mysql.createConnection({
            host: '40.160.19.122',
            port: 3360,
            user: 'coalitionweb',
            password: 'QlZesRtaPe3!!rzgjwQw',
            database: 'coalition',
            connectTimeout: 10000,
            acquireTimeout: 10000,
            timeout: 10000
        });
        
        console.log('✅ Connection successful!');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query test successful:', rows);
        
        await connection.end();
        console.log('✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error errno:', error.errno);
        console.error('Error syscall:', error.syscall);
    }
}

testConnection();
