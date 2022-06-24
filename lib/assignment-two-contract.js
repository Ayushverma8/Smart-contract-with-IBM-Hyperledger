/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
var md5 = require("md5");

const { Contract } = require("fabric-contract-api");

class AssignmentTwoContract extends Contract {
    async assignmentTwoExists(ctx, assignmentTwoId) {
        const buffer = await ctx.stub.getState(assignmentTwoId);
        return !!buffer && buffer.length > 0;
    }

    async createAssignmentTwo(ctx, assignmentTwoId, value) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} already exists`
            );
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assignmentTwoId, buffer);
    }
    // For transaction
    async GenerateContractTransaction(ctx, assignmentTwoId, value) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} already exists`
            );
        }
        let hashed_content = md5(value);
        const asset = {
            agreement_between_parties: value,
            hash_of_agreement: hashed_content,
            status: "",
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assignmentTwoId, buffer);
    }
    // Ends here

    async readAssignmentTwo_024(ctx, assignmentTwoId) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (!exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} does not exist`
            );
        }
        const buffer = await ctx.stub.getState(assignmentTwoId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateAssignmentTwo_024(ctx, assignmentTwoId, newValue) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (!exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} does not exist`
            );
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assignmentTwoId, buffer);
    }

    // assignStatusOfContract
    async assignStatusOfContract_024(ctx, assignmentTwoId, newValue) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (!exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} does not exist`
            );
        }
        const changeTheValue = await this.readAssignmentTwo(
            ctx,
            assignmentTwoId
        );
        changeTheValue.status = newValue;
        const buffer = Buffer.from(JSON.stringify(changeTheValue));
        await ctx.stub.putState(assignmentTwoId, buffer);
    }
    async deleteAssignmentTwo(ctx, assignmentTwoId) {
        const exists = await this.assignmentTwoExists(ctx, assignmentTwoId);
        if (!exists) {
            throw new Error(
                `The assignment two ${assignmentTwoId} does not exist`
            );
        }
        await ctx.stub.deleteState(assignmentTwoId);
    }
    //update ledger with a greeting to show that the function was called
    async instantiate(ctx) {
        let greeting = { text: "Instantiate was called!" };
        await ctx.stub.putState(
            "GREETING",
            Buffer.from(JSON.stringify(greeting))
        );
    }

    //take argument and create a greeting object to be updated to the ledger
    async transaction1(ctx, arg1) {
        console.info("transaction1", arg1);
        let greeting = { text: arg1 };
        await ctx.stub.putState(
            "GREETING",
            Buffer.from(JSON.stringify(greeting))
        );
        return JSON.stringify(greeting);
    }
}

module.exports = AssignmentTwoContract;
