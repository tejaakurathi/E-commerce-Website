const odbc = require('odbc');

async function connectDB() {
    try {
        const connection = await odbc.connect('DRIVER={SQL Server};SERVER=Teja\\SQLEXPRESS;DATABASE=flipkartclone;Trusted_Connection=Yes;');
        console.log('Connected to the database successfully!');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = connectDB;