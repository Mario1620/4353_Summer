const mysql = require('mysql');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Houston!16',
    database: 'Design'
});
database.connect((err)=>{
    if (err) throw err;
    console.log("Connected");
});
module.exports = database;
