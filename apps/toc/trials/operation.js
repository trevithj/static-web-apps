const makeOp = (id, steps) => Object.freeze({id, steps});

export default makeOp;
/*
Notes: where do we put actual Operation process data?
And where should the processing code live? With a Process object, perhaps?
If so, we allocate a Process or Job object to a machine.
This Job contains the operation, the fedby/fedto instructions, and the quantity.
That allows the machine to either queue the Job, or execute it immediately.
That also allows partially complete Jobs to be interrupted.
If the JOB object knows about operation type, the MAC can identify incorrect allocation.
Also, we can have a history of jobs complete, or track jobs against an order.
In effect, an Order is a sequence of Jobs that need doing.

*/

const makeJob = (id, steps) => {
    const job = {
        id,
        jobId: "pending",
        steps,
    }
}