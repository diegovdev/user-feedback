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

let sandbox = null;
let existsUser = null;
let createUser = null;
let existsSession = null;
let createSession = null;
let existsFeedback = null;
let createFeedback = null;
let userId = "ut-user-1001";
let sessionId = "ut-sesssion-2001";
let feedbackId = 3001;

describe('createFeedback.validations.ut', () => {
    before(function (done) {
        config.set('app:datastore', 'memory');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        done();
    });
    beforeEach(function () {
        sandbox = sinon.sandbox.create()
        existsUser = sandbox.stub(memoryDS, 'existsUser').callsFake(async function (user) { return false; });
        createUser = sandbox.stub(memoryDS, 'createUser').callsFake(async function (user) { return userId; });
        existsSession = sandbox.stub(memoryDS, 'existsSession').callsFake(async function (session) { return false; });
        createSession = sandbox.stub(memoryDS, 'createSession').callsFake(async function (session) { return sessionId; });
        existsFeedback = sandbox.stub(memoryDS, 'existsFeedback').callsFake(async function (feedback) { return false; });
        createFeedback = sandbox.stub(memoryDS, 'createFeedback').callsFake(async function (feedback) { return feedbackId; });
    });
    afterEach(function () {
        sandbox.restore()
    });


    it('should fail to create a Feedback when `sessionId` is not provided', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "3",
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/')
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when body is not provided', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(null)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `Ubi-UserId` is not provided in header nor body', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "rating": "3",
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `Ubi-UserId` provided in both header and body', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "3",
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .set("Ubi-UserId", userId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `comment` is not provided', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "3",
            "comment": null
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `rating` is not provided', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": null,
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `rating` values is not a number', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "something",
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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

    it('should fail to create a Feedback when `rating` values is not within the allowed numbers', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": 8,
            "comment": "bad connection"
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).not.to.have.been.calledWith();
            expect(existsSession).not.to.have.been.calledWith();
            expect(createUser).not.to.have.been.calledWith();
            expect(createSession).not.to.have.been.calledWith();
            expect(existsFeedback).not.to.have.been.calledWith();
            expect(createFeedback).not.to.have.been.calledWith();
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
