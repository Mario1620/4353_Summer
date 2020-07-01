//npm install

//create express app
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const Quote = require('./models/quotes');

//Connect to mongoDB
/*
const dbURI = 'mongodb+srv://steven:test123@msrfuel.umlpr.mongodb.net/msr-fuel?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));
*/


//allow the use of ejs
app.set('view engine', 'ejs');

//images middlware/staticfiles
app.use(express.static('public'));
    //accepting form data
app.use(express.urlencoded({ extended: true}));

//get links
    //index
app.get('/', (req,res) => {
    res.render('index', { page: 'Home'});
});
    //quote
app.get('/quote', (req,res) => {
    res.render('quote', { page: 'Get Quote' });
});
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
    //profile
app.get('/profile', (req,res) => {
    res.render('profile', { page: 'Profile' });
});
    //quote history
app.get('/quote_history', (req,res) => {
    res.render('quote_history', { page: 'Quote History' });
});

app.post('/add-quote', (req, res) => {
    console.log(req.body);
    res.redirect('/quote_history');

    /*
    //save to mongoDB 
    const quote = new Quote(req.body);

    quote.save()
        .then (() => {
            res.redirect('/quote_history');
        })
        .catch((err) => {
            console.log(err);
        })
    */

});

/*
    //404
app.use((req,res) => {
    res.render('404', {page: '404 Page Not Found'});
});
*/

app.listen(3000)