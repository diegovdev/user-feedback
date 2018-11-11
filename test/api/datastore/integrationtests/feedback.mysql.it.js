process.env.NODE_ENV = 'test';

const sinon     = require('sinon');
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const sinonChai = require("sinon-chai");
chai.use(chaiHttp);
chai.use(sinonChai);
const config    = require('../../../../config/config');
const datastore = require('../../../../lib/datastore');
const expect    = chai.expect;

//models
const models    = require('../../../../lib/models');
const User      = models.User;
const Session   = models.Session;
const Feedback  = models.Feedback;

//to mock
const mysqlDS   = require('../../../../lib/datastore/mysqlDS');

let sandbox = null;

describe('feedback.mysql.it', () => {
    before(function (done) {
        config.set('app:datastore', 'mysql');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        setTimeout(function(){
            done();
        }, 1000);
    });
    beforeEach(function(done) {
        //remove all entries
        let removeAll = async function() {
            await User.destroy({ where: {} });
            await Session.destroy({ where: {} });
            await Feedback.destroy({ where: {} });
        };
        removeAll().then(function () {
            done();
        })
        .catch(function (error) {
            throw new Error(error);
        });
    });
    beforeEach(function () {
        sandbox = sinon.sandbox.create()
    });
    afterEach(function () {
        sandbox.restore()
    });

    it('should create and return a Feedback from MySql DS', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let userId = "it-user-1001";
        let user = {
            "id": userId,
            "email": userId + "@ubi.soft",
            "nickname": userId
        };
        let sessionId = "it-session-1001";
        let session = {
            "id": sessionId,
            "gameId": 'it-some-game-id'
        };
        let feedback = {
            "rating": 5,
            "comment": "all good",
            "userId": userId,
            "sessionId": sessionId
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        let responseCreateUser = null;
        let responseExistsUser = null;
        let responseCreateSession = null;
        let responseExistsSession = null;
        let responseCreateFeedback = null;
        let responseExistsFeedback = null;
        let runAll = async function() {
            responseCreateUser = await mysqlDS.createUser(user);
            responseExistsUser = await mysqlDS.existsUser(user);
            responseCreateSession = await mysqlDS.createSession(session);
            responseExistsSession = await mysqlDS.existsSession(session);
            responseCreateFeedback = await mysqlDS.createFeedback(feedback);
            responseExistsFeedback = await mysqlDS.existsFeedback(userId, sessionId);
        };
        runAll().then(function () {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(responseCreateUser).to.equal(userId);
            expect(responseExistsUser).to.equal(true);
            expect(responseCreateSession).to.equal(sessionId);
            expect(responseExistsSession).to.equal(true);
            expect(responseCreateFeedback).to.be.a('number');
            expect(responseExistsFeedback).to.equal(true);
            done();
        })
    });

});
