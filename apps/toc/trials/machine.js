
const makeMac = (id, type) => {
    let opId = null;
    let wip = 0;
    let steps = 0;
    return Object.freeze({
        id,
        type,
        get steps() {return steps},
        set steps(arg) {steps = arg},
        get opId() {return opId},
        set opId(arg) {opId = arg},
        get wip() {return wip},
        set wip(arg) {wip = arg},
        toString: () =>  `${id}:${type} wip=${wip}, steps=${steps}, op=${opId}`,
        processStep: () => {
            steps -= 1;
            return "Step processed";
        }
    });
}

export default makeMac;
