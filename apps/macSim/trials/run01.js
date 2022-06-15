const startTime = Date.now();
const endTime = startTime + 5000;

const STATE = {
	delay: 200,
	count: 0,
	mat: [40, 0, 0, 0],
	ops: [
		{fedby:0, fedto:1, time: 2},
		{fedby:1, fedto:2, time: 10},
		{fedby:2, fedto:3, time: 2}
	],
	cash: 1000,
	mac: [
		{ op:0, counter: 2, status: 'running' },
		{ op:1, counter: 5, status: 'setup' },
	]
}

function checkFinish() {
	if (Date.now() > endTime) {
		clearInterval(id);
		console.log('done');
		//console.log(JSON.stringify(STATE, null, 2));
	}
}

function calcNextState() {
  const { mac, mat, ops } = STATE;
  mac.forEach(m => calcMac(m, mat, ops[m.op]));
	STATE.count += 1;
}

function calcMac(mac, mat, op) {
  if(mac.counter > 0) {
    mac.counter -= 1;
  } else {
		mac.counter = op.time - 1;
		if(mac.status==='setup') {
		  mac.status = 'running';
		} else {
			mat[op.fedto] += 1;
		}
		mat[op.fedby] -= 1;
  }
}

function lTrim(n, chars) {
  return `0000000${n}`.slice(-chars);
}

function displayMac(mac) {
	status = mac.status.substring(0,3);
  const sTime = lTrim(mac.counter, 3);
  return `${mac.op}-${status}:${sTime}`;
 }

function displayState() {
  const { mat, mac, ops, count } = STATE;
  const sCount = lTrim(count, 4);
  const sM0 = `M0:${displayMac(mac[0])}`;
  const sM1 = `M1:${displayMac(mac[1])}`;
	console.log(`${sCount}  ${sM0}  ${sM1}  ${mat.map(m => lTrim(m,3))}`);
}

const id = setInterval(() => {
	calcNextState();
	displayState();
	checkFinish();
}, STATE.delay);

