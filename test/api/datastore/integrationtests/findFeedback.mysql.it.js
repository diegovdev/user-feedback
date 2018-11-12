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
const mysqlDS   = require('../../../../lib/datastore/mysqlDS');

let sandbox = null;

describe('findFeedback.mysql.it', () => {
    before(function (done) {
        config.set('app:datastore', 'mysql');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        setTimeout(function(){
            done();
        }, 1000);
    });
    before(function(done) {
        //remove all entries
        mysqlDS.resetData(done);
    });
    before(function (done) {
        let createData = async function() {
            for(let i = 1001; i < 1010; i++) {
                var id = 'it-user-' + i;
                let user = {
                    id: id,
                    email: id+'@ubi.soft',
                    nickname: id
                };
                await mysqlDS.createUser(user);
            }
            for(let i = 2001; i < 2010; i++) {
                let endDate = new Date();
                endDate.setDate(endDate.getDate() + 1);
                var id = 'it-session-' + i;
                let session = {
                    id: id,
                    gameId: 'ubigame-3456',
                    startDate: new Date(),
                    endDate: endDate,
                };
                await mysqlDS.createSession(session);
            }
            for(let i = 1; i <= 5; i++) {
                for(let j = 1; j <= i+1; j++) {
                    let feedback = {
                        rating: i,
                        comment: 'all good',
                        userId: 'it-user-100' + j,
                        sessionId: 'it-session-200' + i
                    };
                    await mysqlDS.createFeedback(feedback);
                }
            }
        };
        createData().then(function () {
            done();
        });
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

    it('should find 2 entries with rating 1', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 1;
        let expectedResultCount = 2;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(rating);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 3 entries with rating 2', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 2;
        let expectedResultCount = 3;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(rating);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 4 entries with rating 3', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 3;
        let expectedResultCount = 4;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(rating);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 5 entries with rating 4', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 4;
        let expectedResultCount = 5;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(rating);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 6 entries with rating 5', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 30;
        let rating = 5;
        let expectedResultCount = 6;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit + '&rating=' + rating)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(rating);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 20 entries when no rating filter and big limit', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 100;
        let expectedResultCount = 20;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(undefined);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should find 4 entries when no rating filter and limit of 4', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let limit = 4;
        let expectedResultCount = 4;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find?limit=' + limit)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(limit);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(undefined);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

    it('should return only 15 entries when no rating filter and no limit', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let expectedResultCount = 15;

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find')
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data).to.not.equal(null);
            expect(res.body.data).to.be.a('object');
            expect(res.body.data.limit).to.equal(15);
            expect(res.body.data.filters).to.not.equal(null);
            expect(res.body.data.filters).to.be.a('object');
            expect(res.body.data.filters.rating).to.equal(undefined);
            expect(res.body.data.count).to.not.equal(null);
            expect(res.body.data.count).to.be.a('number');
            expect(res.body.data.count).to.equal(expectedResultCount);
            done();
        });
    });

});
