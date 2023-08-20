const Default = {
    id: "Mac1",
    output: 0,
    status: 'free',
    // op: null,
    opId: null,
    setupTime: 10,
    process: 0
};

function handleStep(machine) {
    let { status, process, output } = machine;
    switch(status) {
        case "work":
        case "setup": {
            process -= 1;
            if(process <= 0) {
                output = status==="work" ? output + 1 : output;
                status = "taking";
                process = 0;
            }
            return { ...machine, status, process, output };
        }
        default: return machine;
    }
}

function calcMachine(machine = Default, type, payload) {
    switch(type) {
        case "STEP": return handleStep(machine);
        case "ALLOCATE": {
            const { opId } = payload;
            if(machine.opId === opId) {
                // ignore reallocation
                return machine;
            }
            // const op = state.net.operations[opId];
            const process = machine.setupTime;
            return {...machine, status: "setup", process, opId };
        }
        case "TAKE": {
            const { opId, net } = payload;
            if(machine.status !=="taking" || machine.opId !== opId) {
                // ignore take request
                return machine;
            }
            const op = net.ops.find(op => op.id ===opId);
            const process = op.steps;
            return {...machine, status: "work", process };
        }
        default: return machine;
    }
}

export default calcMachine;
