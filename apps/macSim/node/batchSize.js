/*
 * Run a series of simple sims.
 * Each sim consists of a row of serial processors needing to process 20 units.
 * Difference is in the transfer-batch size: 20, 10, 5, 1.
 * Shows stats: average process per unit, per batch, till 1st customer contact.
 *
 * */
const withDelay = false;

function* processor(units = 20, batch = 10) {
	let thisBatch = 0;
	while (units > 0) {
		if(withDelay && Math.random() > 0.95) {
			yield 0; //skip a round
		}
		units -= 1;
		thisBatch += 1;
		if (thisBatch === batch) {
			yield thisBatch;
			thisBatch = 0;
		}	else {
			yield 0;
		}
	}
	return;
}

const lineA = [20,20,20,20].map((b) => [...processor(20, b)]);
const lineB = [10,10,10,10].map((b) => [...processor(20, b)]);
const lineC = [5,5,5,5].map((b) => [...processor(20, b)]);
const lineD = [2,2,2,2].map((b) => [...processor(20, b)]);
const lineE = [1,1,1,1].map((b) => [...processor(20, b)]);
//const line2 = [1,2,3,4].map(() => processor(20, 10));
//const line3 = [1,2,3,4].map(() => processor(20, 5));
//const line4 = [1,2,3,4].map(() => processor(20, 1));

function runLine(line) {
	line.forEach((ly,i) => {
		if (i===0) return;
		const lx = line[i-1];
		lx.some(v => {
			ly.unshift(0);
			return v > 0;
		})
	})

	line.forEach(l => console.log(JSON.stringify(l)));
}


runLine(lineA);
runLine(lineB);
runLine(lineC);
runLine(lineD);
runLine(lineE);
