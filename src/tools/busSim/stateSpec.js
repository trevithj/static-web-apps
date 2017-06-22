const zombie = require('zombie');
const assert = require('assert'); //use Node's built-in asserter


zombie.localhost('example.com', 8888);

const browser = new zombie();
var BASE, state;

describe("Bus Sim ", () => {
	before(() => {
		return browser.visit('/tools/busSim/index.html');
	});
	describe('state', function() {
		before(() => {
			BASE = browser.window.BASE;
		});

		it("should load page OK", ()=> {
			browser.assert.success();
			browser.assert.text('title', 'Bus in Carpark Simulator');
			assert(BASE, "Something wrong with BASE?");
		});

		it("should set location OK", ()=> {
			state = BASE.getState();
			assert.equal(state.location.x, 0);
			assert.equal(state.location.y, 0);
			BASE.dispatch("SET_LOC", {x:2, y:3});
			state = BASE.getState();
			assert.equal(state.location.x, 2);
			assert.equal(state.location.y, 3);
			BASE.dispatch("PLACE", {loc:{x:1, y:2}, dir:"ABC"});
			state = BASE.getState();
			assert.equal(state.location.x, 1);
			assert.equal(state.location.y, 2);
		});

		it("should ignore invalid locations", ()=> {
			BASE.dispatch("SET_LOC", {x:2, y:3});
			state = BASE.getState();
			assert.equal(state.location.x, 2);
			assert.equal(state.location.y, 3);
			assert.equal(state.isValidLoc, true);
			BASE.dispatch("SET_LOC", {x:99, y:-3});
			state = BASE.getState();
			assert.equal(state.location.x, 2);
			assert.equal(state.location.y, 3);
			assert.equal(state.isValidLoc, false);
			BASE.dispatch("PLACE", {loc:{x:-1, y:6}, dir:"ABC"});
			state = BASE.getState();
			assert.equal(state.location.x, 2);
			assert.equal(state.location.y, 3);
			assert.equal(state.isValidLoc, false);
		});

		it("should set direction OK", ()=> {
			state = BASE.getState();
			assert.equal(state.facing, "NORTH");
			BASE.dispatch("SET_DIR", "EAST");
			state = BASE.getState();
			assert.equal(state.facing, "EAST");
			BASE.dispatch("PLACE", {loc:{x:1, y:2}, dir:"WEST"});
			state = BASE.getState();
			assert.equal(state.facing, "WEST");
		});

		it("should ignore invalid directions", ()=> {
			BASE.dispatch("SET_DIR", "EAST");
			state = BASE.getState();
			assert.equal(state.facing, "EAST");
			assert.equal(state.isValidDir, true);
			BASE.dispatch("SET_DIR", "DOWN");
			state = BASE.getState();
			assert.equal(state.facing, "EAST");
			assert.equal(state.isValidDir, false, "DOWN shouldn't be valid");
			BASE.dispatch("PLACE", {loc:{x:1, y:2}, dir:"UP"});
			state = BASE.getState();
			assert.equal(state.facing, "EAST");
			assert.equal(state.isValidDir, false, "UP shouldn't be valid");
		});

		it("should move the bus", ()=> {
			var locatn = {x:2, y:2};
			BASE.dispatch("PLACE", {loc:locatn, dir:"NORTH"});
			BASE.dispatch("MOVE");
			state = BASE.getState();
			assert.notDeepEqual(state.location, locatn);
			locatn.y-=1;
			assert.deepEqual(state.location, locatn);
		});

	});
});


