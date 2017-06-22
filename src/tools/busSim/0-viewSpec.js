const zombie = require('zombie');
const assert = require('assert'); //use Node's built-in asserter


zombie.localhost('example.com', 8888);

const browser = new zombie();
var BASE, state;

describe("Bus Sim ", () => {
	before(() => {
		return browser.visit('/tools/busSim/index.html');
	});
	describe('view', function() {
		before(() => {
			BASE = browser.window.BASE;
		});

		it("should load page OK", ()=> {
			browser.assert.success();
			browser.assert.text('title', 'Bus in Carpark Simulator');
			assert(BASE, "Something wrong with BASE?");
		});

		it("should do initial render OK", ()=> {
			browser.assert.text('#display', 'OK');
			BASE.dispatch("SET_DIR", "DOWN");
			browser.assert.text('#display', 'Direction is invalid');
			browser.assert.element('g#theBus');
			browser.assert.element('g#thePark');
		});

		it("should move the bus", ()=> {
			browser.assert.attribute("#theBus","transform","translate(0,480)");
			BASE.dispatch("SET_LOC", {x:4, y:0});
			browser.assert.attribute("#theBus","transform","translate(480,480)");
		});

		it("should set direction OK", ()=> {
		});

		it("should ignore invalid directions", ()=> {
		});

	});
});


