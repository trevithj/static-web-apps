// Separation of concerns
import { Edges } from "../../apps/beta/graph/edges.js";
// The network. Defined as a list of descendants
const BOM_RAW = `
FG-a9
OP-a9
MP-a7
OP-a7
MP-a6
OP-a6
MP-a5
OP-a5
CP-b3
OP-b3
MP-a1
OP-a1
RM-a0

OP-b3
MP-c1
OP-c1
RM-c0

FG-d9
OP-d9
MP-d7
OP-d7
MP-c5
OP-c5
CP-b3

OP-d7
MP-e5
OP-e5
MP-e2
OP-e2
MP-e1
OP-e1
RM-e0
`.split("\n");

function makeBOMNet(nodeList) {
    let topNode = null;
    return nodeList.reduce((a, n) => {
        if(!n) {
            topNode = null;
            return a;
        }
        if (!topNode) {
            topNode = n;
            return a;
        }
        a.add(topNode, n, 1);
        topNode = n;
        return a;
    }, Edges());
}

const bomNet = makeBOMNet(BOM_RAW);
console.log(bomNet.getAll());
console.log(bomNet.bfs("CP-b3"));
console.log(bomNet.dfs("CP-b3"));
