const assert = require('chai').assert;
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');


var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('app', ()=>{

    describe('Quote input and redirections', function(){
        /*
        it('Quote should return 200 Status', function(done){
            request(app)
            .get('/quote').expect(200).end(done);
        });

        //good input
        it('Quote POST should accept a good input', function(done){
            request(app)
            .post('/add-quote').type('form').send({quantity: 23, address: "1234 Street", delivery: '2020-03-23'}).then(function(){
                request(app).get('/quote_history').expect(200).expect(/Quote History/, done);
            });
        });

        //bad quantity
        it('Quote POST should not accept a bad quantity', function(done){
            request(app)
            .post('/add-quote').type('form').send({quantity: "bad", address: "1234 Street", delivery: '2020-03-23'}).then(function(){
                request(app).get('/quote').expect(200).expect(/Get Quote/, done);
            });
        });
        
        //bad date
        it('Quote POST should not accept a bad date', function(done){
            request(app)
            .post('/add-quote').type('form').send({quantity: 1234, address: "1232 Street", delivery: 'hello'}).then(function(){
                request(app).get('/quote').expect(200).expect(/Get Quote/, done);
            });
        });

        //bad address
        it('Quote POST should not accept a bad address', function(done){
            request(app)
            .post('/add-quote').type('form').send({quantity: 23, address: 234, delivery: '2020-03-23'}).then(function(){
                request(app).get('/quote').expect(200).expect(/Get Quote/, done);
            });
        });
        */



        it('Quote should return 200 Status', function(done){
            request(app)
            .get('/quote').expect(200).end(done);
        });

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
            .expect(/quotes/)
            .end(done);
        });

    });
});
  