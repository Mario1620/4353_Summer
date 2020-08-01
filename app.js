//npm install

//create express app
const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('./database');
//password encryption information
const bcrypt = require('bcrypt');
const saltRounds = 10;
//allow the use of ejs
app.set('view engine', 'ejs');

//images middlware/staticfiles
app.use(express.static('public'));
    //accepting form data
app.use(express.urlencoded({ extended: true}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//get links
    //index

app.get('/', (req,res) => {
    res.render('index', { page: 'Home', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname});
});

    //quote
app.get('/quote', (req,res) => {
    var address = req.session.Address1+ " "+ req.session.City+" "+req.session.State+" "+req.session.ZipCode;
    console.log(address);
    res.render('quote', { page: 'Get Quote', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, Address: address });
    
    
});
app.get('/finalize_quote', (req,res)=>{
    res.render('finalize_quote', {page: 'Confirm Quote', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, Gallons: req.session.Gallons, Address: req.session.Address,
     DeliveryDate: req.session.deliveryDate, State: req.session.state, Total: req.session.total, SuggestedPrice: (req.session.total/req.session.Gallons)});
});


    //login
    app.get('/login', (req,res) => {
        if(req.query.login == "failed") {
            res.render('login', { page: 'Login', loggedin: req.session.loggedin, User: req.session.Username,Fullname: req.session.Fullname, login: "Username or password is incorrect"});
        }
        else 
            res.render('login', { page: 'Login', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname,login: ""});
    });
        //register
    app.get('/register', (req,res) => {
        if(req.query.error == "match") {
            res.render('register', { page: 'Sign Up' , loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, error: "Passwords do not match or not 8 characters or more" });
        }
        else if (req.query.error == "user") {
            res.render('register', { page: 'Sign Up' , loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname,  error: "Username is already taken" });
        }
        else if (req.query.error == "invaliduser") {
            res.render('register', { page: 'Sign Up' , loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, error: "Username must 8 characters or more" });
        }
        else 
            res.render('register', { page: 'Sign Up' , loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, error: "" });
    });

app.get('/logout', (req,res)=>{
   req.session.destroy();
    res.redirect('/');
});





//profile
app.get('/profile', (req,res) => {
    var sql = 'SELECT * FROM Profile WHERE Username = ?';
    mysql.query(sql, req.session.Username, (err, result)=>{
        console.log(req.session.Username);
        if(result === undefined)
        {
            res.render('profile', { page: 'Profile', loggedin: req.session.loggedin, User: req.session.Username, Fullname:undefined });
        
        }
        else{
            console.log("Yes");
           
    res.render('profile', { page: 'Profile', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, Address1: req.session.Address1, 
    Address2: req.session.Address2, City: req.session.City, State: req.session.State, ZipCode: req.session.ZipCode});
            
        }
    });

});

    //profile information
app.get('/profile_info', (req,res) => {
    
    
    res.render('profile_info', { page: 'Profile Information', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, Address1: req.session.Address1, 
    Address2: req.session.Address2, City: req.session.City, State: req.session.State, ZipCode: req.session.ZipCode});
    
});

    //quote history
    app.get('/quote_history', (req,res) => {
        var resultArray;
        var sql = 'SELECT * FROM QuoteHistory WHERE Username = ?';
        mysql.query(sql, req.session.Username, (err, result)=>{
            if(err) throw err;
            console.log(result);
            if(result.length === 0)
            {
                res.render('quote_history', { page: 'Quote History', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, quotes: undefined });
            }
            else{
                resultArray = result;
    
                if(req.query.quote == "created")
                {
                    res.render('quote_history', { page: 'Quote History', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, quotes: resultArray, message: "Quote created successfully" });
                }
                else
                    res.render('quote_history', { page: 'Quote History', loggedin: req.session.loggedin, User: req.session.Username, Fullname: req.session.Fullname, quotes: resultArray, message: "" });
            }
        });
        
    });

    //profile post
app.post('/add-profile', (req,res) => {
    console.log(1);
    

    const num = /\d/;
    var words = /^[a-zA-Z ]*$/;
    var word = /[A-z]+/;
    const numAndLetter = /'0-9a-zA-Z'/;
	
    var user = req.body.Username;
    var full = req.body.fullname;
    var add1 = req.body.Address1;
    var add2 = req.body.Address2;
    var city1 = req.body.city;
    var state1 = req.body.states;
    var zip = req.body.zipcode;


    if (words.test(full) && full.length <= 50) {
        //console.log("hello");
        if (isNaN(add1) && add1.length <= 100) {
            //console.log("2hello");
            if ((isNaN(add2) && add2.length <= 100) || add2.length == 0){
                //console.log("3hello");
                if(words.test(city1) && city1.length <= 100){
                    //console.log("4hello");
                    if (word.test(state1)) {//get-state
                        if (num.test(zip) && 5 <= zip.length && zip.length <= 9) {
                            //console.log("6hello");
                            //res.redirect('/');
				            
                            var sql = "SELECT * FROM Profile WHERE Username = ?";
                            mysql.query(sql, req.session.Username, (err,result)=>{
                                if(result === undefined){ //user submitting form for first time
                                    var sql_profile = "INSERT INTO Profile SET ?";
                                    var pro = ({
                                        "Username": user,
                                        "Fullname": full,
                                        "Address1": add1,
                                        "Address2": add2,
                                        "City": city1,
                                        "State": state1,
                                        "ZipCode": zip
                                    });
                                    var query = mysql.query(sql_profile, pro, (err, result) => {
                                        if (err)  throw err;
                                        else {
                                            req.session.Fullname = full;
                                            req.session.Address1 = add1;
                                            req.session.Address2 = add2;
                                            req.session.City = city1;
                                            req.session.State =  state1;
                                            req.session.ZipCode = zip;
                                
                                            var query = "UPDATE Users SET Status = 'Old' WHERE Username = " + mysql.escape(user);
                                            mysql.query(query, req.session.Username, (err, result)=>{
                                                if(err) throw err;
                                                console.log('Status Changed...');
                                            });
                                            res.redirect('/');
                                            //console.log("You successfully created the profile page!");
                                        }
                                    });
                                }
                                else{ // user updating info
                                    console.log('Yay2222');
                                    var pro = ({
                                        
                                        "Fullname": full,
                                        "Address1": add1,
                                        "Address2": add2,
                                        "City": city1,
                                        "State": state1,
                                        "ZipCode": zip
                                    });
                                    var sql = "UPDATE Profile SET  ? WHERE Username = "+ mysql.escape(user);
                                    mysql.query(sql,pro,(err,result)=>{
                                        if(err) throw err;
                                        console.log('Yay');
                                        req.session.Fullname = full;
                                            req.session.Address1 = add1;
                                            req.session.Address2 = add2;
                                            req.session.City = city1;
                                            req.session.State =  state1;
                                            req.session.ZipCode = zip;
                                        
                                    });
                                    res.redirect('profile_info');

                                }
                            });
                            
                           

                           
                        }
                        else {
                            //return res.status(401).send({ "message": "A `zip code` is required" });
                            res.redirect('/profile');
                        }
                    }
                    else {
                        //return res.status(401).send({ "message": "A `state` is required" });
                        res.redirect('/profile');
                    }
                }
                else {
                    //return res.status(401).send({ "message": "A `city` is required" });
                    res.redirect('/profile');
                }
            }
            else {
                res.redirect('/profile');
            }
        }
        else {
            //return res.status(401).send({ "message": "An `address` is required" });
            res.redirect('/profile');
        }
    }
    else{
        //return res.status(401).send({ "message": "A `full name` is required" });
        res.redirect('/profile');
    }

});



app.post('/info_profile', (req, res)=> {
    res.redirect('profile');
    // let sql = "SELECT * FROM Profile WHERE Username = " + mysql.escape(req.body.Username);
    // let query = mysql.query(sql, (err, results) => {
    //     info = {
    //         Username: req.session.Username,
    //         Fullname: req.session.Fullname,
    //         Address1: req.session.Address1,
    //         Address2: req.session.Address2,
    //         City: req.session.City,
    //         State: req.session.State,
    //         ZipCode: req.session.Zipcode
    //     };
    //     sql = 'INSERT INTO Profile SET ?';
    //     query = mysql.query(sql, quote, (err, result) => {
    //         if(err) throw err;
    //         res.redirect('/profile');
    //     });

    // });
});

    //quote post
    app.post('/add-quote', (req, res) => {
        //check if quantity is a integer and positive
        if(!isNaN(req.body.quantity) && req.body.quantity > 0 && req.body.quantity.length > 0) {
            //check if date is string and is a date
            if(req.body.delivery.length > 0 && Date.parse(req.body.delivery)) {
                //check if address is string and not empty
                
                    let sql = "SELECT * FROM Profile WHERE Username = " + mysql.escape(req.body.quoteUser);
                    let query = mysql.query(sql, (err, results) => {
                        if(err) throw err;
    
                        let date = new Date();
                        console.log(results[0].State);
                        req.session.Address = results[0].Address1+ ' '+ results[0].State;
                        req.session.Gallons = req.body.quantity;
                        req.session.deliveryDate = req.body.delivery; 
                        req.session.state = results[0].State;
                        sql = "SELECT * FROM QuoteHistory WHERE Username = " +  mysql.escape(req.body.quoteUser);
                        mysql.query(sql,(err,result)=>{
                            if(err) throw err;
                            req.session.total = formula(req.session.Gallons, req.session.state, result);
                            res.redirect('/finalize_quote');
                        });
                        
                        
                    });
            }
            else {
                //console.log(req.body);
                //console.log("Bad Date");
                res.redirect('/quote');
            }
        }
        else {
            //console.log(req.body);
            //console.log("Bad Quantity");
            res.redirect('/quote');
        }
    });
    


    app.post('/submit_quote', (req,res)=>{
        var sql = "SELECT * FROM Profile WHERE Username = " + mysql.escape(req.body.quoteUser);
        mysql.query(sql, (err,result)=>{
            if(err) throw err;
            quote = {          
                Gallons: req.session.Gallons,
                RequestDate: new Date(),
                DeliveryDate: req.body.delivery,
                Address: req.session.Address,
                State: req.session.state,
                Username:  req.body.quoteUser,
                SuggestedPrice: (req.session.total/req.session.Gallons),
                Total: req.session.total    
                };
                console.log(`This is the suggested price from the finalize quote: ${req.session.total/req.session.Gallons}`);
                sql = 'INSERT INTO QuoteHistory SET ?';
        query = mysql.query(sql, quote, (err, result) => {
        if(err) throw err;
        res.redirect('/quote_history?quote=created');
        }); 
        });
        
    
                        
        
                        
                        
});

app.post('/cancel_quote', (req,res)=>{
    req.session.Address = undefined;
    req.session.state = undefined;
    req.session.Gallons = undefined;
    req.session.deliveryDate = undefined;
    req.session.total = undefined;
    res.redirect('/quote');
});

function formula(Gallons, State, result) {//formula for get quote page
    /*
    Suggested Price = Current Price + Margin
    Where,
    Current price per gallon = $1.50 (this is the price what distributor gets from refinery and it varies based upon crude price. But we are keeping it constant for simplicity)
    Margin =  Current Price * (Location Factor - Rate History Factor + Gallons Requested Factor + Company Profit Factor)
    Consider these factors:
    Location Factor = 2% for Texas, 4% for out of state.
    Rate History Factor = 1% if client requested fuel before, 0% if no history (you can query fuel quote table to check if there are any rows for the client)
    Gallons Requested Factor = 2% if more than 1000 Gallons, 3% if less
    Company Profit Factor = 10% always
    */

    var suggestPrice;
    var currentPrice = 1.50;
    var margin;
    var locationFactor;
    //var state; //
    var rateHistory;
    //var rateFuel; //quoteHistory
    var gallonsRequested;
    //var gallons = req.body.quantity.length; //
    var companyProfit = 10/100;
    //var totalAmount;


    //gallons requested factor
    if (Gallons > 1000) {
        gallonsRequested = 2/100;
    }
    else {
        gallonsRequested = 3/100;
    }
    console.log(gallonsRequested);  

    //location factor
    if (State == "TX") {
        
        locationFactor = 2/100;
    }
    else {
        locationFactor = 4/100;
    }
    console.log(locationFactor);    

    //get the state, gallons, and rate history from the db?
    /*var sql = 'SELECT Gallons, State FROM QuoteHistory WHERE Username = ' + mysql.escape(username);
    mysql.query(sql, (err,result)=>{
        
        if(err) throw err;
    });*/

    console.log(result);
    if(result.length === 0) {
        rateHistory = 0;
    }
    else{
        rateHistory = 1/100;
    }
    console.log(rateHistory); 

    margin = currentPrice * (locationFactor - rateHistory + gallonsRequested + companyProfit);
    console.log('This is the formula function section');
    console.log(`Margin Price is: ${margin}`);
    suggestPrice = currentPrice + margin;
    console.log(`Suggested Price is: ${suggestPrice}`);

    totalAmount = Gallons * suggestPrice;
    console.log(totalAmount);    
    
    return totalAmount;
};

//login post
app.post('/get-login', (req,res)=>{
    var userGivenUsername = req.body.Username;
    var userGivenPassword = req.body.Password;
    //check for valid Username
    var sql = 'SELECT * FROM Users WHERE Username = ?';
    mysql.query(sql,userGivenUsername, (err,result)=>{
        
        if(err) throw err;
        
        if(result.length === 1){ //if userGivenUsername is clean
            
            var hash = result[0].Password;
         //check to see if Password given hashes to the Password in the DB for this User
         bcrypt.compare(userGivenPassword, hash, (err, match)=> {
            if(!match)res.redirect('login?login=failed');//Passwords do NOT a MATCH
                
            else{ //Passwords do MATCH, continue with login process
            //store SESSION variables
                req.session.Username = userGivenUsername;
                req.session.loggedin = true;

                if(result[0].Status === 'New'){
                    
                    req.session.Fullname = undefined;
                    req.session.Address1 = undefined;
                    req.session.Address2 = undefined;
                    req.session.City = undefined;
                    req.session.State = undefined;
                    req.session.ZipCode = undefined;
                    res.redirect('profile');

                }
                else{
                    var sql = "SELECT * FROM Profile WHERE Username = "+mysql.escape(req.session.Username);
                    mysql.query(sql, (err,result)=>{
                        req.session.Fullname = result[0].Fullname;
                        req.session.Address1 = result[0].Address1;
                        req.session.Address2 = result[0].Address2;
                        req.session.City = result[0].City;
                        req.session.State = result[0].State;
                        req.session.ZipCode = result[0].ZipCode;
                        console.log(req.session.Fullname);
                        console.log(req.session.Address1);
                        console.log(req.session.Address2);
                        console.log(req.session.City);
                        console.log(req.session.State);
                        console.log(req.session.ZipCode);
                        res.redirect('/');
                    });
                    

                }

            }
        });
    }
        else{ // if userGivenUsername is no good
            res.redirect('login?login=failed');
        }
    });
});



    
    
  



//register functionality
//missing password encryption, come back to later
app.post('/add-user', (req,res)=>{
    var Username = req.body.Username;
    var Password = req.body.Password;
    var ConfirmPassword = req.body.ConfirmPassword;
    //first check for dirty input
    const numAndLetter = /\w/;
    if(numAndLetter.test(Username) && Username.length >= 8)
    {
        if(Password === ConfirmPassword && numAndLetter.test(Password) && Password.length >=8){
            //clean input, continue to see if username is taken
            var sql = "SELECT * FROM Users WHERE Username = ?";
            mysql.query(sql, Username, (err, result)=>{
                if(!result.length){ //username is not taken, complete registration
                    bcrypt.hash(Password, saltRounds, function(err, hash) { //encrypt the plaintext Password and store it in DB during registration process
                        if (err) throw err;

                        var sql = "INSERT INTO Users VALUES (?,?, ?)";
                    var newUser = [Username, hash, 'New'];
                    mysql.query(sql, newUser, (err, result)=>{
                        if(err) throw err;
                        console.log("New User Added...");
                        res.redirect('login');
                    });
                        
                    });
                    

                }
                else{ //Username is taken
                    
                    res.redirect('register?error=user');
                }

            });
        }
        else{ //password issue
            res.redirect('register?error=match');
        }
    }
    else{ //Username issue
        res.redirect('register?error=invaliduser');
    }
    

});




/*
    //404
app.use((req,res) => {
    res.render('404', {page: '404 Page Not Found'});
});
*/
var PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{console.log(`Server running on PORT ${PORT}` )});

module.exports = app;
