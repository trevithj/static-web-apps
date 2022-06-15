const endTime = 30; //in ticks

const CLI = require('./cli.js');
const CALC = require('./macCalcs.js');
const makeStore = require('./store.js');

function makeMat(mat, qty = 1) {
	return {mat, qty};
}
const STATE = {
	delay: 200,
	count: 0,
	store: makeStore(),
	ops: {
		A:{
			id:'A',
			fedby:[makeMat('RM')],
			fedto:[makeMat('M1')],
			setup: 60,
			time: 2
		},
		B: {
			id: 'B',
			fedby:[makeMat('M1')],
			fedto:[makeMat('M2')],
			setup: 20,
			time: 10
		},
		C: {
			id: 'C',
			fedby:[makeMat('M2')],
			fedto:[makeMat('FG')],
			setup: 60,
			time: 2
		}
	},
	cash: 1000,
}

const MAC = {
	counter: 0,
	currentOp: null,
	nextOp: null,
	status: 'ready',
}

STATE.store.init([
 ['RM', 40], ['M1', 0], ['M2', 0], ['FG', 0]
]);

function* getTicker(state, mac) {
	while(true) {
		const { store, ops } = state;
		state.count += 1;
		const { status } = mac;
		if(status === 'setup') {
			CALC.doSU(mac)
		} else if (status === 'running') {
			CALC.doRunning(mac, store);
		} else if (status === 'ready') {
			CALC.doReady(mac, store);
		}
		if(mac.status==='idle') {
			CALC.doIdle(mac, store)
		}
		yield state.count;
	}
}

const storeDisplay = () => STATE.store.IDs().map(id => {
	const soh = STATE.store.peek(id);
	return ` mat: ${id} ${CLI.toCol(15)}soh:${soh}`;
}).join('\n');

const opsDisplay = () => Object.keys(STATE.ops).map(opId => {
	const op = STATE.ops[opId];
	const { fedby, fedto, setup, time } = op;
	return [
		`${opId} ${CLI.toCol(15)}Setup:${setup} ${CLI.toCol(30)}Runtime:${time}`,
		`--fedby: ${JSON.stringify(fedby)}`,
		`--fedto: ${JSON.stringify(fedto)}`,
	].join('\n');
}).join('\n');

function doRender() {
	CLI.clearScreen();
	console.log(`${CLI.goto()}Machine info`);
	const thisOp = `CurrentOp: ${renderOp(MAC.currentOp)}`;
	const nextOp = `NextOp: ${renderOp(MAC.nextOp)}`;
	const countr = `Counter  : ${CLI.blueText(MAC.counter)}`;
	const timer  = `Time  : ${CLI.blueText(STATE.count)}`;

	console.log(` ${thisOp} ${CLI.toCol(30)}${nextOp}`);
	console.log(` ${countr} ${CLI.toCol(30)}${timer}`);
	console.log(` Status   : ${CLI.greenText(MAC.status)}`);
	console.log(`\nStore Info`);
	console.log(`${storeDisplay()}`);
	console.log(`\nOps Info`);
	console.log(`${opsDisplay()}`);
}

function renderOp(op) {
	return op ? `ID:${op.id} SU:${op.setup} RU:${op.time}` : 'none';
}

const ticker = getTicker(STATE, MAC);
//init ticker
ticker.next();
doRender();

CLI.onKeypress(key => {
	switch(key) {
		case 'q': {
			console.log(CLI.goto(20) + 'Done');
			process.exit();
		}
		case 'a':
		case '1': {
			MAC.nextOp = STATE.ops.A; break;
		}
		case 'b':
		case '2': {
			MAC.nextOp = STATE.ops.B; break;
		}
		case 'c':
		case '3': {
			MAC.nextOp = STATE.ops.C; break;
		}
	}
	ticker.next();
	doRender();
});
