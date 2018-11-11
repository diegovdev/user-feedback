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

describe('session.mysql.it', () => {
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

    it('should create and return a Session from MySql DS', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let sessionId = "it-session-1001";
        let session = {
            "id": sessionId,
            "gameId": 'it-some-game-id'
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        let responseCreate = null;
        let responseExists = null;
        let runAll = async function() {
            responseCreate = await mysqlDS.createSession(session);
            responseExists = await mysqlDS.existsSession(session);
        };
        runAll().then(function () {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(responseCreate).to.equal(sessionId);
            expect(responseExists).to.equal(true);
            done();
        })
    });

});
