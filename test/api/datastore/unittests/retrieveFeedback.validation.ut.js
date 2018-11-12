process.env.NODE_ENV = 'test';

const sinon     = require('sinon');
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const sinonChai = require("sinon-chai");
chai.use(chaiHttp);
chai.use(sinonChai);
const server    = require('../../../../app');
const config    = require('../../../../config/config');
const datastore = require('../../../../lib/datastore');
const expect    = chai.expect;
const request   = chai.request;

//to mock
const memoryDS  = require('../../../../lib/datastore/memoryDS');


describe('retrieveFeedback.validations.ut', () => {
    before(function (done) {
        config.set('app:datastore', 'memory');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        done();
    });


    it('should fail to retrieve Feedbacks when `rating` value is invalid', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = "something";

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.not.equal(null);
            expect(res.body.error.message).to.be.a('string');
            done();
        });
    });

    it('should fail to retrieve Feedbacks when `rating` value is out of range', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 60;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.not.equal(null);
            expect(res.body.error.message).to.be.a('string');
            done();
        });
    });

    it('should fail to retrieve Feedbacks when `limit` value is a string', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = "something";
        let rating = 4;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.not.equal(null);
            expect(res.body.error.message).to.be.a('string');
            done();
        });
    });

    it('should fail to retrieve Feedbacks when `limit` value is negative', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = -3;
        let rating = 4;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.not.equal(null);
            expect(res.body.error.message).to.be.a('string');
            done();
        });
    });

    it('should fail to retrieve aa Feedbacks when `feedbackId` is not provided', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let feedbackId = null;
        let rating = 4;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find/' + feedbackId)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.not.equal(null);
            expect(res.body.error.message).to.be.a('string');
            done();
        });
    });

});
