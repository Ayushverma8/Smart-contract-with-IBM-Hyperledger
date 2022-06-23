/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AssignmentTwoContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('AssignmentTwoContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AssignmentTwoContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"assignment two 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"assignment two 1002 value"}'));
    });

    describe('#assignmentTwoExists', () => {

        it('should return true for a assignment two', async () => {
            await contract.assignmentTwoExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a assignment two that does not exist', async () => {
            await contract.assignmentTwoExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAssignmentTwo', () => {

        it('should create a assignment two', async () => {
            await contract.createAssignmentTwo(ctx, '1003', 'assignment two 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"assignment two 1003 value"}'));
        });

        it('should throw an error for a assignment two that already exists', async () => {
            await contract.createAssignmentTwo(ctx, '1001', 'myvalue').should.be.rejectedWith(/The assignment two 1001 already exists/);
        });

    });

    describe('#readAssignmentTwo', () => {

        it('should return a assignment two', async () => {
            await contract.readAssignmentTwo(ctx, '1001').should.eventually.deep.equal({ value: 'assignment two 1001 value' });
        });

        it('should throw an error for a assignment two that does not exist', async () => {
            await contract.readAssignmentTwo(ctx, '1003').should.be.rejectedWith(/The assignment two 1003 does not exist/);
        });

    });

    describe('#updateAssignmentTwo', () => {

        it('should update a assignment two', async () => {
            await contract.updateAssignmentTwo(ctx, '1001', 'assignment two 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"assignment two 1001 new value"}'));
        });

        it('should throw an error for a assignment two that does not exist', async () => {
            await contract.updateAssignmentTwo(ctx, '1003', 'assignment two 1003 new value').should.be.rejectedWith(/The assignment two 1003 does not exist/);
        });

    });

    describe('#deleteAssignmentTwo', () => {

        it('should delete a assignment two', async () => {
            await contract.deleteAssignmentTwo(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a assignment two that does not exist', async () => {
            await contract.deleteAssignmentTwo(ctx, '1003').should.be.rejectedWith(/The assignment two 1003 does not exist/);
        });

    });

});
