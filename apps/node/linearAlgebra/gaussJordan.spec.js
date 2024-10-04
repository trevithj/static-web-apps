import CHAI from "chai"; // for the expect assertions
import {makeRow} from "./gaussJordan.js";

const { expect } = CHAI;

describe("makeRow", () => {
    it("should complain if not passed an array of numbers", () => {
        const test = () => makeRow();
        expect(test).to.throw("Function requires an array of numbers.")
    })
    it("should return an object if successful", () => {
        const row = makeRow([1,2,3,4]);
        expect(row).to.be.a("object");
        expect(row.scale).to.be.a("function");
        expect(row.values).to.be.a("array");
        expect(row.toString()).to.equal("1,2,3,4");

    })
    it("should perform expected operations", () => {
        const row = makeRow([1,2,3,4]);
        const tenRow = row.scale(10);
        expect(tenRow.toString()).to.equal("10,20,30,40");

        const addRow = row.add(tenRow);
        expect(addRow.toString()).to.equal("11,22,33,44");

        const minusRow = tenRow.add(row, -2);
        expect(minusRow.toString()).to.equal("8,16,24,32");
    })

    it("should be useful", () => {
        const r1 = makeRow([1,1,1,12]);
        const r2 = makeRow([2,3,0,18]);
        const r3 = makeRow([0,3,3,21]);
        // Forward pass
        const r4 = r1;
        const r5 = r2.add(r1, -2);
        const r6 = r3.add(r5, -3).scale(1/9);
        console.log(4, r4.toString());
        console.log(5, r5.toString());
        console.log(6, r6.toString());
        // Backward pass
        const r9 = r6;
        const r8 = r5.add(r6, 2);
        const r7 = r4.add(r9, -1).add(r8, -1);
        console.log(7, r7.toString());
        console.log(8, r8.toString());
        console.log(9, r9.toString());
    })
})
