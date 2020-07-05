//npm install

//create express app
const express = require('express');
const app = express();

//allow the use of ejs
app.set('view engine', 'ejs');

//images middlware/staticfiles
app.use(express.static('public'));
    //accepting form data
app.use(express.urlencoded({ extended: true}));

//get links
    //index
/*
app.get('/', (req,res) => {
    res.render('index', { page: 'Home'});
});
*/
    //quote
app.get('/quote', (req,res) => {
    res.render('quote', { page: 'Get Quote' });
});

/*
    //login
app.get('/login', (req,res) => {
    res.render('login', { page: 'Login' });
});

    //register
app.get('/register', (req,res) => {
    res.render('register', { page: 'Sign Up' });
});
    //register
app.get('/forgotpassword', (req,res) => {
    res.render('forgotpassword', { page: 'Forgot Password' });
});
*/
/*
    //profile
app.get('/profile', (req,res) => {
    res.render('profile', { page: 'Profile' });
});
*/
    //quote history
app.get('/quote_history', (req,res) => {
    res.render('quote_history', { page: 'Quote History' });
});

app.post('/add-quote', (req, res) => {
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


/*
app.post('/getlogin', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});
*/

/*
    //404
app.use((req,res) => {
    res.render('404', {page: '404 Page Not Found'});
});
*/

app.listen(3000)

module.exports = app;