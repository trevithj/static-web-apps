//Simulate a set of processes, where each process either moves a single token
// or not, based on a 'coin-toss' 1:1 probability.
const heads = [0, 0, 0, 0];
function tossCoin(index = 0) {
    //heads is true, tails is false
    const toss = Math.random() > 0.5;
    if (toss) heads[index] += 1;
    return toss;
}

function formatN(n) {
    return `   ${n}`.slice(-3);
}

function makeStore(input, wip = 0) {
    let output = 0;
    const st = {input, wip, output};
    st.moveIn = (qty = 1) => {
        if (st.input >= qty) {
            st.input -= qty;
            st.wip += qty;
        }
        else throw new Error('Not enough input');
    }
    st.moveWip = (qty = 1) => {
        if (st.wip >= qty) {
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
    while (n > 0) {
        if (tossCoin(n - 1)) {
            store.moveIn(); store.moveWip();
        }
        n -= 1;
    }
}
function runInSeries(store) {
    if (tossCoin(2)) {store.moveIn();}
    if (tossCoin(3)) {store.moveWip();}
}

function doRun() {
    const Store1 = makeStore(200);
    const Store2 = makeStore(200);


    let count = 100;
    while (count > 0) {
        //Run two processes in parallel...
        runInParallel(Store1, 2);
        //... and two in series.
        runInSeries(Store2);
        runInSeries(Store2); //two ticks, to match parallel scenario
        count -= 1;
    }
    console.log(`Stores: #1 ${Store1.show()}\t#2 ${Store2.show()}`);
    //	console.log(Store2.show());
    return {Store1, Store2};
}

let runs = 1000;
const totals = {s1: 0, s2: 0};
while (runs > 0) {
    runs -= 1;
    const {Store1, Store2} = doRun();
    totals.s1 += Store1.output;
    totals.s2 += Store2.output;
}

console.log(totals);
console.log(heads);
heads.forEach((h, p) => {
    const percent = (p < 2) ? h / 100000 : h / 200000;
    console.log(`Process ${p} total heads ${h} (${percent}%)`);
});
