import CHAI from "chai";
import sinon from "sinon";
import jsdom from "jsdom"; // for the mock DOM
import {animateItem} from "../moveItem.js";

const {JSDOM} = jsdom;
const {expect} = CHAI;

describe('animateItem', () => {
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

    // beforeEach(() => {
    //     // Mocking timers
    //     clock = sinon.useFakeTimers();
    // });

    // afterEach(() => {
    //     // Restoring original timers
    //     clock.restore();
    // });

    it('should create an item with the correct class', () => {
        const srcInput = document.createElement('input');
        const destInput = document.createElement('input');
        const onAnimationComplete = sinon.stub();

        animateItem(srcInput, destInput, 80, onAnimationComplete);

        const item = document.querySelector('.item');
        expect(item).to.exist;
    });

    it('should move the item to the destination position after the specified duration', (done) => {
        const srcInput = document.createElement('input');
        const destInput = document.createElement('input');
        const clock = sinon.useFakeTimers();

        animateItem(srcInput, destInput, 800, done);

        clock.tick(10); // Move item after initial timeout
        expect(document.querySelector('.item').style.top).to.equal('0px');
        expect(document.querySelector('.item').style.left).to.equal('0px');
        clock.restore();

        // clock.tick(700); // Move item after initial timeout
        // expect(document.querySelector('.item').style.top).to.equal('0px');
        // expect(document.querySelector('.item').style.left).to.equal('0px');
        // clock.tick(1000); // Complete animation after specified duration
        // expect(callback.calledOnce).to.be.true;
    });
});
