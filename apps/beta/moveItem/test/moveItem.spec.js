import CHAI from "chai"; // for the expect assertions
import jsdom from "jsdom"; // for the mock DOM
import sinon from "sinon"; // for the mock timers
import {moveItem} from "../moveItem.js";

const { JSDOM } = jsdom;
const { expect } = CHAI;
// console.log(Object.keys(jsdom));
//const { expect } = require('chai');
//const { moveItem } = require('./your-module'); // Replace 'your-module' with the path to your module containing the moveItem function

describe('moveItem', () => {
    let sourceInput, destinationInput;
    before(() => {
        // Setting up a virtual DOM environment
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;

        // Creating source and destination input elements
        sourceInput = document.createElement('input');
        sourceInput.value = 5;

        destinationInput = document.createElement('input');
        destinationInput.value = 0;

        document.body.appendChild(sourceInput);
        document.body.appendChild(destinationInput);
    });

    after(() => {
        // Cleaning up after tests
        delete global.document;
    });

    it('should throw error if quantity is not a number', () => {
        expect(() => moveItem(sourceInput, destinationInput, 'abc')).to.throw('Please enter a valid quantity.');
    });

    it('should throw error if quantity is negative', () => {
        expect(() => moveItem(sourceInput, destinationInput, -1)).to.throw('Please enter a valid quantity.');
    });

    it('should throw error if source has insufficient items', () => {
        expect(() => moveItem(sourceInput, destinationInput, 10)).to.throw('Not enough items in the source store.');
    });

    it('should update source and destination values after successful move', (done) => {
        const clock = sinon.useFakeTimers();
        moveItem(sourceInput, destinationInput, 2, (src, tgt) => {
            // also checks that the callback is invoked
            expect(typeof src).to.equal('object');
            expect(typeof tgt).to.equal('object');
            expect(sourceInput.value).to.equal('3');
            expect(destinationInput.value).to.equal('2');
            done();
        });
        clock.tick(2000); // allow plenty of time for animations to complete
        clock.restore();
    });

});
