const mysql = require('mysql');
const database = mysql.createConnection({
    host: 'cosc4353project.cn6fzragcwuf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Houston!20',
    database: 'MSRFuel'
});
database.connect((err)=>{
    if (err) throw err;
    console.log("Connected");
});


module.exports = database;