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

//to mock
const mysqlDS   = require('../../../../lib/datastore/mysqlDS');

let sandbox = null;

describe('user.mysql.it', () => {
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
        mysqlDS.resetData(done);
    });
    beforeEach(function () {
        sandbox = sinon.createSandbox()
    });
    afterEach(function () {
        sandbox.restore()
    });
    after(function (done) {
        //remove all entries
        mysqlDS.resetData(done);
    });

    it('should create and return a User from MySql DS', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let userId = "it-user-1001";
        let user = {
            "id": userId,
            "email": userId + "@ubi.soft",
            "nickname": userId
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        let responseCreate = null;
        let responseExists = null;
        let runAll = async function() {
            responseCreate = await mysqlDS.createUser(user);
            responseExists = await mysqlDS.existsUser(user);
        };
        runAll().then(function () {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(responseCreate).to.equal(userId);
            expect(responseExists).to.equal(true);
            done();
        })
    });

});
