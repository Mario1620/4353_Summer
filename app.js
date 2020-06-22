//Everything I used for this project
/*
npm init -y //this creates a node project in your current directory
npm i express -save 
npm i express-session -save //this is for login authentication session_start() in PHP
npm i mysql -save
npm i ejs -save //this is for rendering dynamic html pages 
npm i body-parser -save
npm i bcrypt -save //paswword hashing
*/
const express = require('express');
const session = require('express-session');
const mysql = require('./database.js'); //gives access to DB connection info
const app = express(); //express object created 
const { static } = require('express');
const path = require('path'); //core module
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //load password hashing library
const { nextTick } = require('process');
//const salt = 10; 


//set up middleware here
app.use(session({secret: '1257033_207919380_111711'}));
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(static(path.join(__dirname, 'public')));

//database example to verify it is working
const select = "SELECT * FROM Users";
/*mysql.query(select,(err,result)=>{
    if(err) throw err;
    console.log(result);
}); */

//using express to serve the index page
//when you search for 'localhost:5000', you will get served the index.html page
//from the public folder
app.get('/', (req,res)=>{
    res.sendFile('index.html');
});


/*
app.post('url',urlencodedParser, (req,res)=>{
    function body 
});
 */

app.post('/register.html',urlencodedParser, (req,res)=>{
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Confirm = req.body.ConfirmPassword;
    if(Password === Confirm){ //passwords match, continue with registration
    //is user already registered?
    var query = "SELECT Username FROM Users WHERE Username = ?";
    mysql.query(query,Username,(err,result)=>{
        //if(err) throw err;
        
        if(result.length > 0){
            res.end("Shit");
        }
        else{
            //bcrypt.hash(Password, salt,(err, enc)=>{
              //  Password = enc;
                
            //});
            
            var query1 = "INSERT INTO Users (Username, Password) VALUES (?,?)";
            const values = [Username, Password];
            mysql.query(query1, values, (err,result)=>{
                if (err) throw err;
                console.log(`User Added: ${Username} with ${Password}`);
               
                //redirect/display something about registration success
                res.redirect('/login.html');
            });
        }
    });
    
    
}
else{ //passwords do not match
res.redirect('/error.html');
}
});

app.post('/login.html', urlencodedParser, (req,res)=>{
    var Username = req.body.Username;
    var Password = req.body.Password;
    const check = "SELECT Username FROM Users WHERE Username = ? AND Password = ?";
    const logincheck = [Username, Password];
    mysql.query(check, logincheck, (err,result) =>{
        if(err) throw err;
        req.session.Username = Username;
        req.session.Password = Password;
        res.render('loggedin.ejs', {User: req.session.Username, Password: req.session.Password });
        //res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});


//PORT variable is going to be from any available Port, if not 5000 
const PORT = process.env.PORT || 5000;
//start our express server, listening on our port variable
app.listen(PORT, ()=>{console.log(`Server running on PORT ${PORT}`)});