const assert = require('chai').assert;
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');


var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('app', ()=>{

    describe('Statuses', function(){
        it('Index should return 200 Status', function(done){
            request(app)
            .get('/').expect(200).end(done);
        });
        it('Quote should return 200 Status', function(done){
            request(app)
            .get('/quote').expect(200).end(done);
        });
        it('Login should return 200 Status', function(done){
            request(app)
            .get('/login').expect(200).end(done);
        });
        it('Register should return 200 Status', function(done){
            request(app)
            .get('/register').expect(200).end(done);
        });
        it('Quote History should return 200 Status', function(done){
            request(app)
            .get('/quote_history').expect(200).end(done);
        });
    });

    describe('Quote input and redirections', function(){

        //good input
        it('Quote POST should accept a good input', function(done){
            request(app)
            .post('/add-quote')
            .type('form')
            .send({quantity: 23, address: "1234 Street", delivery: '2020-03-23'})
            .expect(/quote_history/)
            .end(done);
        });
        //bad quantity
        it('Quote POST should not accept a bad quantity (is string/empty/negative)', function(done){
            request(app)
            .post('/add-quote')
            .type('form')
            .send({quantity: "bad", address: "1234 Street", delivery: '2020-03-23'})
            .expect(/quote/)
            .end(done);
        });
        //bad date
        it('Quote POST should not accept a bad date (not in date format)', function(done){
            request(app)
            .post('/add-quote')
            .type('form')
            .send({quantity: 1234, address: "1232 Street", delivery: 'hello'})
            .expect(/quote/)
            .end(done);
        });
        //bad address
        it('Quote POST should not accept a bad address (is a number)', function(done){
            request(app)
            .post('/add-quote')
            .type('form')
            .send({quantity: 23, address: 234, delivery: '2020-03-23'})
            .expect(/quote/)
            .end(done);
        });

    });
  
    //Profile test
    describe('profile', ()=>{
        it('profile should return OK status', function(done){
            request(app)
            .get('/profile').expect(200).end(done);
            /*.then(function(response){
                assert.equal(response.status, 200)
            })*/
        });

        //good input
        it('profile POST should accept a good input', function(done){
            request(app)
            .post('/add-profile')
            .type('form')
            .send({fullname: 'Ruth Soto', address1: '123 Smith St.', address2: '', city: 'Houston', state: 'TX', zipcode: 77123})
            .expect(/\//)
            .end(done);
        });
        //bad input for name
        it('profile POST should not accecpt a bad name', function(done){
            request(app)
            .post('/add-profile')
            .type('form')
            .send({fullname: '&hfnie((', address1: '123 Smith St.', address2: '', city: 'Houston', state: 'TX', zipcode: 77123})
            .expect(/profile/)
            .end(done);
            
        });
        //bad input for address1
        it('profile POST should not accecpt a bad address1', function(done){
            request(app)
            .post('/add-profile').type('form').send({fullname: 'Ruth Soto', address1: 123, address2: '', city: 'Houston', state: 'TX', zipcode: 77123})
            .expect(/profile/)
            .end(done);
        });
        //bad input for address2
        it('profile POST should not accecpt a bad address2', function(done){
            request(app)
            .post('/add-profile').type('form').send({fullname: 'Ruth Soto', address1: '123 Smith St.', address2: 583, city: 'Houston', state: 'TX', zipcode: 77123})
            .expect(/profile/)
            .end(done);
        });
        //bad input for city
        it('profile POST should not accecpt a bad city', function(done){
            request(app)
            .post('/add-profile').type('form').send({fullname: 'Ruth Soto', address1: '123 Smith St.', address2: '', city: 'nvief8439(@', state: 'TX', zipcode: 77123})
            .expect(/profile/)
            .end(done);
        });
        //bad input for state
        it('profile POST should not accecpt a empty state', function(done){
            request(app)
            .post('/add-profile').type('form').send({fullname: 'Ruth Soto', address1: '123 Smith St.', address2: '', city: 'Houston', state: '', zipcode: 77123})
            .expect(/profile/)
            .end(done); 
        });
        //bad input for zipcode
        it('profile POST should not accecpt a bad zipcode', function(done){
            request(app)
            .post('/add-profile').type('form').send({fullname: 'Ruth Soto', address1: '123 Smith St.', address2: '', city: 'Houston', state: 'TX', zipcode: 77})
            .expect(/profile/)
            .end(done); 
        });
    });


    //Mario's test section


   describe('login', ()=>{
    it('login should return 200 Status', function(done){
        request(app)
        .get('/login').expect(200).end(done);
        });


        it('login POST should accept a good input and send to index if Status != New', function(done){
            request(app)
            .post('/get-login').type('form').send({Username: 'Mario123', Password: 'Houston16'}).then(function(){
                request(app).get('/').expect(200).expect(/MSR Fuel/, done);
            });
        });
     
    it('login POST should not accept wrong input', function(done){
        request(app).post('/get-login').type('form')
        .send({Username: 'Wrong', Password: 'Input'}).expect(/login/).end(done);
        
           
        });

    it('login POST should accept good input and send to profile if Status == New', function(done){
        request(app).post('/get-login').type('form').send({Username: 'Testing123', Password: 'Password01'})
        
            .expect(/profile/, done);
        
    });
        


    });

    describe('Register', function(){
        it('Register GET request should return 200', function(done){
            request(app).get('/register').expect(200).end(done);
        });
        //This test needs to be updated every time with a new user that doesnt exists
        it('Register POST should add a new user', function(done){
            request(app).post('/add-user').type('form').send({Username: 'Testingx1', Password: 'Password01', ConfirmPassword: 'Password01'})
            .then(function(){
                request(app).get('/login').expect(/login/).end(done);
            });
            
        });

        //This should work but SQL prevents it from running
        it('Register POST should not add an existing user', function(done){
            request(app).post('/add-user').type('form')
            .send({Username: 'administrator1', Password: 'Password01', ConfirmPassword: 'Password01'})
            .expect(/register/).end(done);
            
        });  

        it('Register POST should fail if Username does not meet requirements', function(done){
            request(app).post('/add-user').type('form')
            .send({Username: 'admin1', Password: 'Password01', ConfirmPassword: 'Password01'})
            .expect(/register/).end(done);
           

        });
        it('Register POST should fail if Password does not meet requirements', function(done){
            request(app).post('/add-user').type('form')
            .send({Username: 'administrator2', Password: 'Pass1', ConfirmPassword: 'Pass1'})
            .expect(/register/).end(done);
           

        });

        it('Register POST should fail if Passwords do not meet match', function(done){
            request(app).post('/add-user').type('form')
            .send({Username: 'adminstrator2', Password: 'Password01', ConfirmPassword: 'Password02'})
            .expect(/register/).end(done);
       
        }); 




    });
});
  
