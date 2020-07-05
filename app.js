//npm install

//create express app
const express = require('express');
const app = express();
const session = require('express-session');
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
//hard coded array to simulate a DB for login purposes
const Person_array = [{Username:'Mario123', Password:'Houston16'}, {Username: 'Steven123', Password: 'Austin123'}, {Username: 'RuthE123', Password: 'Dallas123'}];

//get links
    //index

app.get('/', (req,res) => {
    res.render('index', { page: 'Home', loggedin: req.session.loggedin, User: req.session.Username});
});

    //quote
app.get('/quote', (req,res) => {
    res.render('quote', { page: 'Get Quote', loggedin: req.session.loggedin, User: req.session.Username });
});


    //login
app.get('/login', (req,res) => {
    res.render('login', { page: 'Login', loggedin: req.session.loggedin, User: req.session.Username});
});
    //register
app.get('/register', (req,res) => {
    res.render('register', { page: 'Sign Up' , loggedin: req.session.loggedin, User: req.session.Username });
});

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/');
});



    //profile
app.get('/profile', (req,res) => {
    res.render('profile', { page: 'Profile', loggedin: req.session.loggedin, User: req.session.Username });
});
/*
app.get('/get-state', (req, res) => {
    console.log(req.body.profile);
    //console.log(req.body);
    //res.redirect('/profile');
});
*/
    //quote history
app.get('/quote_history', (req,res) => {
    res.render('quote_history', { page: 'Quote History', loggedin: req.session.loggedin, User: req.session.Username });
});
app.post('/add-profile', (req,res) => {
    /*Full Name (50 characters, required)
	- Address 1 (100 characters, required)
	- Address 2 (100 characters, optional)
	- City (100 characters, required)
	- State (Drop Down, selection required) DB will store 2 character state code
    - Zipcode (9 characters, at least 5 character code required) min is 5, max is 9 */
    
    /*if(!req.body.fullname){
        return res.status(401).send({ "message": "A `full name` is required" });
    }
    else if(!req.body.address1){
        return res.status(401).send({ "message": "An `address` is required" });
    }
    else if(!req.body.city){
        return res.status(401).send({ "message": "A `city` is required" });
    }
    else if(!req.body.state){
        return res.status(401).send({ "message": "A `state` is required" });
    }
    else if(!req.body.zipcode){
        return res.status(401).send({ "message": "A `zip code` is required" });
    }*/

    //const profile_info = [{fullname: 'Ruth Soto', address1: '123 Smith St.', address2: '456 Main St.', city: 'Houston', state: 'TX', zipcode: 77123}]
    //const profile_info = [{fullname: 'Mario Villareal', address1: '123 Smith St.', address2: '', city: 'Houston', state: 'TX', zip: '77123'}, {fullname: 'Steven Khong', address1: '456 Main St.', address2: '', city: 'Dallas', state: 'TX', zip: '74783'}, {fullname: 'Ruth Soto', address1: '783 Sam Rd.', address2: '', city: 'Austin', state: 'TX', zip: '72893'}]

    const num = /\d/;
    var words = /^[a-zA-Z ]*$/;
    var word = /[A-z]+/;
    const numAndLetter = /'0-9a-zA-Z'/;

    var full = req.body.fullname;
    var add1 = req.body.address1;
    var add2 = req.body.address2;
    var city1 = req.body.city;
    var state1 = req.body.state;
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
                            //res.send(profile_info);
                            res.redirect('/');
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


app.post('/add-quote', (req, res) => {


    class PricingModule {

    }
    
    //check if quantity is a integer and positive
    if(!isNaN(req.body.quantity) && req.body.quantity > 0 && req.body.quantity.length > 0) {
        //check if date is string and is a date
        if(req.body.delivery.length > 0 && Date.parse(req.body.delivery)) {
            //check if address is string and not empty
            if(req.body.address.length > 0 && isNaN(req.body.address)){
                //console.log(req.body);
                //console.log("Correct Input");
                res.redirect('/quote_history');
            }
            else {
                //console.log(req.body);
                //console.log("Bad Address");
                res.redirect('/quote');
            }
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





app.post('/get-login', (req,res)=>{
    var Username = req.body.Username;
    var Password = req.body.Password;

    var match = Person_array.find((person, index)=>{
        if(person.Username === Username && person.Password === Password){
            return true;
        }
    });
    if(match){
        req.session.loggedin = true;
        req.session.Username = Username;
        res.redirect('/');
        res.end();
    }
    else{
        
        res.redirect('login');
        res.end();
        
    }
});




/*
    //404
app.use((req,res) => {
    res.render('404', {page: '404 Page Not Found'});
});
*/

app.listen(3000)

module.exports = app;
