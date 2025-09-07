const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: 'mysql',
        logging: console.log,
    });

    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
        
        // Test if the a4stats table exists
        const [results] = await sequelize.query("SHOW TABLES LIKE 'a4stats'");
        if (results.length > 0) {
            console.log('✅ a4stats table exists');
            
            // Check if stored procedure exists
            const [procedures] = await sequelize.query("SHOW PROCEDURE STATUS WHERE Name = 'GetUserA4Stats'");
            if (procedures.length > 0) {
                console.log('✅ GetUserA4Stats stored procedure exists');
            } else {
                console.log('❌ GetUserA4Stats stored procedure does not exist');
            }
        } else {
            console.log('❌ a4stats table does not exist');
        }
        
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
