process.env.NODE_ENV = 'test';

const sinon     = require('sinon');
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const sinonChai = require("sinon-chai");
chai.use(chaiHttp);
chai.use(sinonChai);
const server    = require('../../../../app');
const config    = require('../../../../config/config');
const datastore = require('../../../../engine/datastore');
const expect    = chai.expect;
const request   = chai.request;

//to mock
const memoryDS  = require('../../../../engine/datastore/memoryDS');

let sandbox = null;

describe('retrieveFeedback.ut', () => {
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

    it('should GET a single Feedback', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let feedbackId = 3;
        let existingFeedback = {
            "id": feedbackId,
            "rating": "4",
            "comment": "all good",
            "createdAt": "2018-11-11T15:08:16.000Z",
            "updatedAt": "2018-11-11T15:08:16.000Z",
            "userId": "user-from-header-002",
            "sessionId": "ses-555-0001"
        };
        let getFeedback = sandbox.stub(memoryDS, 'getFeedback').callsFake(async function (feedbackId) { return [ existingFeedback ]; });

        //--WHEN--------------------------------------------------------------------------------------------------------
        request(server)
        .get('/api/v1/feedback/find/' + feedbackId)
        .end((err, res) => {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(getFeedback).to.have.been.calledWith();
            expect(res.status).to.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.equal('ok');
            expect(res.body.data.count).to.equal(1);
            expect(res.body.data.result).to.be.a('array');
            expect(res.body.data.result[0]).to.be.a('object');
            expect(res.body.data.result[0].id).to.equal(feedbackId);
            done();
        });
    });

});
