function toArray(txt = "") {
    return txt.split("\n").flatMap(line => {
        line = line.trimEnd();
        return line.length === 0 ? [] : line;
    });
}

let index = 0;
// Sketch-format parser
export function stateParser(txt) {
    index = 0;
    let currentNode = null;
    const lines = toArray(txt);
    const nodeMap = {}; // map id -> node
    const nameMap = {}; // map name -> node
    const links = [];
    lines.forEach(line => {
        const {indent, type, ...data} = parseLine(line);
        if (type === "node") {
            const node = processNode(data, nameMap);
            nodeMap[node.id] = node;
            nameMap[node.name] = node;
            currentNode = node;
        } else { // assume a link, re-process once all nodes are in.
            const {label, target} = data;
            const node = processNode({name: target.trim()}, nameMap);
            nodeMap[node.id] = node;
            nameMap[node.name] = node;
            links.push({src: currentNode.id, tgt: node.id, label});
        }
    })
    return {nodes: Object.values(nodeMap), links, nodeMap};
}

function parseLine(raw) {
    const indent = raw.search(/\S/);
    const name = raw.trim();
    const link = name.split(" -> ");
    if (link.length > 1) {
        const [label, target] = link;
        return {indent, type: "link", label, target};
    } // otherwise it is a node
    return {indent, type: "node", name};
}

function processNode(data, nameMap) {
    const existingNode = nameMap[data.name];
    if (existingNode) {
        return existingNode;
    }
    const id = `n${index++}`;
    const newNode = {...data, id};
    return newNode;
}

function updateStack(stack, node) {
    const peek = stack[stack.length - 1];
    if (node.indent > peek.indent) {
        stack.push(node);
    } else {
        stack.pop();
        updateStack(stack, node);
    }
}

function makeLink(stack) {
    const len = stack.length;
    const src = stack[len - 2].id;
    const tgt = stack[len - 1].id;
    return {src, tgt};
}

// Structure-format parser
export function structureParser(txt) {
    const nodeStack = [];
    const lines = toArray(txt);
    const nodeMap = {}; // map id -> node
    const links = [];
    const nodes = [];
    lines.forEach(line => {
        const node = parseLineWithIndent(line);
        nodeMap[node.id] = node;
        nodes.push(node);
    })

    nodes.forEach((node, index) => {
        if (index === 0) {
            nodeStack.push(node);
            return;
        }
        if (node.indent === 0) {
            throw new Error("Invalid format: must only have one parent node");
        }
        updateStack(nodeStack, node);
        links.push(makeLink(nodeStack));
    })

    return {nodes, links, nodeMap};
}

function parseLineWithIndent(raw) {
    const indent = raw.search(/\S/);
    const name = raw.trim();
    const id = `n${index++}`;
    return {id, indent, name};
}

export function stringify(parsed) {
    const {nodeMap, ...rest} = parsed;
    const value = [];
    Object.entries(rest).forEach(([k, v]) => {
        value.push(
            `"${k}":[`,
            v.map(val => "  " + JSON.stringify(val)).join(",\n"),
            "],"
        );
    })
    if (nodeMap) {
        value.push(
            "nodeMap: {",
            Object.entries(nodeMap).map(([k, v]) => {
                return `  "${k}": ${JSON.stringify(v)}`;
            }).join(",\n"),
            "}"
        );
    }
    return value.join("\n");
}
// export function stringify(parsed) {
//     const {nodes, links, nodeMap} = parsed;
//     const value = [
//         "nodes:[",
//         nodes.map(node => "  " + JSON.stringify(node)).join(",\n"),
//         "],",
//         "links: [",
//         links.map(link => "  " + JSON.stringify(link)).join(",\n"),
//         "],",
//         "nodeMap: {",
//         Object.entries(nodeMap).map(([k, v]) => {
//             return `  "${k}": ${JSON.stringify(v)}`;
//         }).join(",\n"),
//         "}"
//     ].join("\n");
//     return value;
// }