/*jshint esversion: 6 */
const zombie = require('zombie');
const expect = require('chai').expect;

//assumes localhost:8888 server is running.
//run `node server.js` in src folder.

zombie.localhost('example.com', 8888);

const browser = new zombie();
var BASE;

describe("logicMap ", () => {
	before(() => {
		return browser.visit('/tools/logicMap/index.html');
	});
	describe('state', function() {
		before(() => {
			BASE = browser.window.BASE;
		});

		it("should load page OK", ()=> {
			browser.assert.success();
			browser.assert.text('title', 'Logic Map V0.1');
			expect(BASE, "Something wrong with BASE?").to.exist;
		});

		it("should set views", ()=> {
			expect(BASE.getState().view).to.not.equal("ABC");
			BASE.dispatch("SET_VIEW", "ABC");
			var state = BASE.getState();
			expect(BASE.getState().view).to.equal("ABC");
		});

		it("should set nodes", ()=> {
//			console.dir(BASE.getState());
			var nodes = BASE.getState().nodes;
			expect(nodes, "nodes not set?").to.be.an('object');
			var newNodes = ["N1 ABC", "N2	DEF"];
			BASE.dispatch("SET_NODES", newNodes);
			nodes = BASE.getState().nodes;
			expect(nodes, "nodes not set?").to.be.an('object');
			expect(nodes, "SET_NODE not working?").to.have.all.keys("N1","N2");
			expect(nodes["N2"]).to.equal("DEF");
		});

		it("should set links", ()=> {
			var links = BASE.getState().links;
			expect(links, "links not set?").to.be.an('array').that.is.empty;
			BASE.dispatch("SET_LINKS", ["[N1,N2][n3]","[N4,N5] some stuff [n3]"]);
			links = BASE.getState().links;
			expect(isValidLink(links[0])).to.be.true;
			expect(isValidLink(links[1])).to.be.true;
		});
	});
});

function isValidLink(link) {
	if(!link) throw new Error("Link is not set");
	expect(link.srcs).to.be.an('array','Invalid srcs');
	expect(link.tgts).to.be.an('array','Invalid tgts');
	isArrayOfStrings(link.srcs, "Invalid srcs contents");
	isArrayOfStrings(link.tgts, "Invalid tgts contents");
	return true;
}

function isArrayOfStrings(a, msg) {
	msg = msg || "Non-strings in array"
	var flag = a.every(n => typeof n === 'string');
	if(!flag) throw new Error(msg);
	return true;
}

/*
Bug in Zombie since updating to Node 8.x
somewhere between request/request.js: 755 and lib/reroute.js:67, the options object gets wrapped in an array.
*/
