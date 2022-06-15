/*
 * READY
 *   currentOp===null -> READY
 *   currentOp==set -> SETUP
 * SETUP
 *   counter>0 -> SETUP
 *   counter===0 -> IDLE
 * IDLE
 *   currentOp===null -> READY
 *   soh===0 -> IDLE
 *   soh > 0 -> RUNNING
 * RUNNING
 *   counter>0 -> RUNNING
 *   counter===0 -> IDLE
 *
 *
 */
function doMacRunning(mac, store) {
	 if(mac.counter > 0) {
     mac.counter -= 1;
   } else {
		 pushSOH(store, mac.currentOp);
		 mac.status = 'idle';
   }
}

function doMacIdle(mac, store) {
	if(!mac.currentOp) {
		mac.status = 'ready';
	} else if (mac.nextOp) {
			mac.currentOp = mac.nextOp;
			mac.nextOp = null;
			mac.status = 'ready';
	} else {
		const soh = pullSOH(store, mac.currentOp);
		if (soh) {
			mac.status = 'running';
			mac.counter = mac.currentOp.time;
		}
	}
}

function doMacReady(mac) {
	if(!mac.currentOp) {
			mac.currentOp = mac.nextOp;
			mac.nextOp = null;
	}
  if(mac.currentOp) {
    mac.status = 'setup';
    mac.counter = mac.currentOp.setup;
  }
}

function doMacSU(mac) {
	 if(mac.counter > 0) {
     mac.counter -= 1;
   } else {
		 mac.status = 'idle';
   }
}

function pullSOH(store, op) {
	let noCanTake = op.fedby.some(def => {
		const soh = store.peek(def.mat);
		if(soh < def.qty) return true;
	});
	if (noCanTake) {
		return false;
	} else {
		return op.fedby.map(def => store.pull(def.mat, def.qty));
	}
}

function pushSOH(store, op) {
	op.fedto.forEach(def => store.push(def.mat, def.qty));
}

module.exports = {
	doSU: doMacSU,
	doReady: doMacReady,
	doIdle: doMacIdle,
	doRunning: doMacRunning,
	pullSOH,
	pushSOH,
};
