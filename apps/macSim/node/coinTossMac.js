// Simple variable-time process, heads it processes 1 unit, tails it does not.

function * processing(unitsPerTick = 1, initSOH = 1) {
  let soh = initSOH;
  let processed;
  while(true) {
    const coin = Math.random() > 0.5 ? 'h' : 't';
    if (coin === 't') {
      processed = 0;
    } else if (soh < unitsPerTick) {
      processed = soh;
    } else {
      processed = unitsPerTick;
    }
    //leave it to external code to modify SOH for future work.
    soh = yield { units: processed, coin };
  }
}

let soh = 7;

const macOp = processing(2, soh);
let { units, coin } = macOp.next().value;
Array(20).fill(1).forEach(() => {
  soh -= units;
  console.log(`${coin}: ${units} - ${soh}`);
  const val = macOp.next(soh).value;
  coin = val.coin;
  units = val.units;
})
