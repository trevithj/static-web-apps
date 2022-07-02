//Simulate a set of processes, where each process either moves a single token
// or not, based on a 'coin-toss' 1:1 probability.
function tossCoin(index = 0) {
	//heads is true, tails is false
	const toss = Math.random() > 0.5;
	return toss;
}

function formatN(n) {
	return `   ${n}`.slice(-3);
}

function makeStore(input, wip=0) {
	let output = 0;
	const st = { input, wip, output };
	st.moveIn = (qty = 1) => {
		if(st.input >= qty) {
			st.input -= qty;
			st.wip += qty;
		}
		else throw new Error('Not enough input');
	}
	st.moveWip = (qty = 1) => {
		if(st.wip >= qty) {
			st.wip -= qty;
			st.output += qty;
		} //otherwise ignore
	}
	st.show = () =>
		`${formatN(st.input)} ->[${formatN(st.wip)}]-> ${formatN(st.output)}`;

	return st;
}

function runInParallel(store, n = 2) {
	//Run n processes in parallel...
	while(n > 0) {
		if (tossCoin(n-1)) {
			store.moveIn(); store.moveWip();
		}
		n -= 1;
	}
}
function runInSeries(store) {
	if (tossCoin(2)) { store.moveIn(); }
	if (tossCoin(3)) { store.moveWip(); }
}

function doRun(n = 100) {
	const Store1 = makeStore(2*n);
	const Store2 = makeStore(2*n);
	const pLog = [];
	const sLog = [];

	let count = n;
	while(count > 0) {
		//Run two processes in parallel...
		runInParallel(Store1, 2);
		pLog.push(Store1.show());
		//... and two in series.
		runInSeries(Store2);
		sLog.push(Store2.show());
		runInSeries(Store2); //two ticks, to match parallel scenario
		sLog.push(Store2.show());
		count -= 1;
	}
	console.log(`Stores: #1 ${Store1.show()}\t#2 ${Store2.show()}`);
	console.log(pLog);
	console.log(sLog);
	return { Store1, Store2 };
}

doRun(10);
