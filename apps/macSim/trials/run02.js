const endTime = 30; //in ticks

const makeStore = require('./store.js');
const { displayState, displayMac } = require('./utils.js');

const STATE = {
	delay: 200,
	count: 0,
	store: makeStore(),
	ops: [
		{fedby:'RM', fedto:'M1', time: 2},
		{fedby:'M1', fedto:'M2', time: 10},
		{fedby:'M2', fedto:'FG', time: 2}
	],
	cash: 1000,
	mac: [
		{ op:0, counter: 2, status: 'running' },
		{ op:1, counter: 5, status: 'setup' },
	]
}
STATE.store.init([
 ['RM', 40], ['M1', 0], ['M2', 0], ['FG', 0]
]);

function checkFinish() {
	if (STATE.count > endTime) {
		clearInterval(id);
		displayState.done();
		//console.log(JSON.stringify(STATE, null, 2));
	}
}

function* getTicker(state) {
	while(true) {
		const { mac, store, ops } = state;
		mac.forEach(m => calcMac(m, store, ops[m.op]));
		state.count += 1;
		yield state.count;
	}
}

function calcMac(mac, store, op) {
  if(mac.counter > 0) {
    mac.counter -= 1;
  } else {
		mac.counter = op.time - 1;
		if(mac.status==='setup') {
		  mac.status = 'running';
		} else {
			store.push(op.fedto, 1);
		}
		store.pull(op.fedby, 1);
  }
}

const ticker = getTicker(STATE);
const id = setInterval(() => {
	ticker.next();
	displayState(STATE);
	checkFinish();
}, STATE.delay);

