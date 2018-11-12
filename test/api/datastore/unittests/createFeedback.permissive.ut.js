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

describe('createFeedback.permissive.ut', () => {
    before(function (done) {
        config.set('app:datastore', 'memory');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        done();
    });
    beforeEach(function () {
        sandbox = sinon.createSandbox()
    });
    afterEach(function () {
        sandbox.restore()
    });


    it('should fail to create a new Feedback when entry already exists for provided sessionId and userId', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let userId = "ut-user-1001";
        let sessionId = "ut-sesssion-2001";
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "2",
            "comment": "good gaming session"
        };
        let existsUser = sandbox.stub(memoryDS, 'existsUser').callsFake(async function (user) { return true; });
        let existsSession = sandbox.stub(memoryDS, 'existsSession').callsFake(async function (session) { return true; });
        let existsFeedback = sandbox.stub(memoryDS, 'existsFeedback').callsFake(async function (feedback) { return true; });

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).to.have.been.calledWith();
            expect(existsSession).to.have.been.calledWith();
            expect(existsFeedback).to.have.been.calledWith();
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.not.equal(null);
            expect(res.body.error).to.be.a('object');
            expect(res.body.error.message).to.equal("Feedback for sessionId="+sessionId+" and userId="+userId+" was already submitted.");
            done();
        });
    });

    it('should create a new Feedback taking userId from body', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let userId = "ut-user-1001";
        let sessionId = "ut-sesssion-2001";
        let feedbackId = 3001;
        let newFeedback = {
            "Ubi-UserId": userId,
            "rating": "2",
            "comment": "good gaming session"
        };
        let existsUser = sandbox.stub(memoryDS, 'existsUser').callsFake(async function (user) { return false; });
        let createUser = sandbox.stub(memoryDS, 'createUser').callsFake(async function (user) { return userId; });
        let existsSession = sandbox.stub(memoryDS, 'existsSession').callsFake(async function (session) { return false; });
        let createSession = sandbox.stub(memoryDS, 'createSession').callsFake(async function (session) { return sessionId; });
        let existsFeedback = sandbox.stub(memoryDS, 'existsFeedback').callsFake(async function (feedback) { return false; });
        let createFeedback = sandbox.stub(memoryDS, 'createFeedback').callsFake(async function (feedback) { return feedbackId; });

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).to.have.been.calledWith();
            expect(existsSession).to.have.been.calledWith();
            expect(createUser).to.have.been.calledWith();
            expect(createSession).to.have.been.calledWith();
            expect(existsFeedback).to.have.been.calledWith();
            expect(createFeedback).to.have.been.calledWith();
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data.id).to.equal(feedbackId);
            done();
        });
    });

    it('should create a new Feedback taking userId from header', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let userId = "ut-user-1001";
        let sessionId = "ut-sesssion-2001";
        let feedbackId = 3001;
        let newFeedback = {
            "rating": "2",
            "comment": "good gaming session"
        };
        let existsUser = sandbox.stub(memoryDS, 'existsUser').callsFake(async function (user) { return false; });
        let createUser = sandbox.stub(memoryDS, 'createUser').callsFake(async function (user) { return userId; });
        let existsSession = sandbox.stub(memoryDS, 'existsSession').callsFake(async function (session) { return false; });
        let createSession = sandbox.stub(memoryDS, 'createSession').callsFake(async function (session) { return sessionId; });
        let existsFeedback = sandbox.stub(memoryDS, 'existsFeedback').callsFake(async function (feedback) { return false; });
        let createFeedback = sandbox.stub(memoryDS, 'createFeedback').callsFake(async function (feedback) { return feedbackId; });

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .post('/api/v1/feedback/create/' + sessionId)
        .set('Ubi-UserId', userId)
        .send(newFeedback)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(existsUser).to.have.been.calledWith();
            expect(existsSession).to.have.been.calledWith();
            expect(createUser).to.have.been.calledWith();
            expect(createSession).to.have.been.calledWith();
            expect(existsFeedback).to.have.been.calledWith();
            expect(createFeedback).to.have.been.calledWith();
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data.id).to.equal(feedbackId);
            done();
        });
    });

});
