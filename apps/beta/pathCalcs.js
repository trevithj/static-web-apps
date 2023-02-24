function defaultMapWagons(SIZE, n) {
    if (n===SIZE-1) return "loco";
    return n < 20 ? "wagon" : "long";
}

function calcOffset(position, prevLength, length) {
    const multi = 0.2;
    if(length === prevLength) return position + prevLength * multi;
    if(length < prevLength) return position + (prevLength*0.75) * multi;
    if(length > prevLength) return position + (prevLength*1.5) * multi;
}

function makeTrain(SIZE, thePath, mapWagons = defaultMapWagons) {
    const theTrain = new Array(SIZE)
    .fill(1)
    .flatMap((x, n) => mapWagons(SIZE, n))
    .map(cls => {
        const el = BASE.createElSVG('rect');
        const length = cls==="long" ? 2 : 1;
        el.classList.add(cls);
        el.setAttribute("x", -10 * length);
        // el.setAttribute("dx", 10 * (length-1));
        el.setAttribute("y", -4);
        el.setAttribute("width", length * 20);
        el.setAttribute("height", 8);
        return { el, length };
    });

    let position = 0;
    let prevLength = 1;
    return theTrain.map(({el, length, ...rest}, i) => {
        el.style.offsetPath=`path("${thePath}")`;
        // el.style.pathLength=2000;
        const offset = calcOffset(position, prevLength, length);
        const from = `${offset}%`; 
        const till = `${100 + offset}%`;
        position = offset;
        prevLength = length;
        // console.log(length, from, till) 
        return { el, length, from, till, ...rest };
    });
}
