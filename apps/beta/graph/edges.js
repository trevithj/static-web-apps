const getLinksBySource = linkArray => theSrc => linkArray.filter(link => link[0] === theSrc);

function processLink(visited, stackOrQueue) {
    return link => {
        const neighbor = link[1];
        if (!visited[neighbor]) {
            visited[neighbor] = true;
            stackOrQueue.push(neighbor);
        }
    }
}
const doBFS = linkArray => (start, process) => {
    const getBySource = getLinksBySource(linkArray);
    const queue = [start];
    const visited = {start: true};
    let currentVertex;
    while (queue.length) {
        currentVertex = queue.shift();
        process(currentVertex);
        getBySource(currentVertex).forEach(processLink(visited, queue));
    }
}

// iterative version
export const doDFS = linkArray => (start, process) => {
    const getBySource = getLinksBySource(linkArray);
    const stack = [start];
    const visited = {[start]: true};

    while (stack.length) {
        const vertex = stack.pop();
        process(vertex);
        getBySource(vertex).reverse().forEach(processLink(visited, stack));
    }
}

// recursive version
export const doRecursiveDFS = links => (start, process) => {
    const getBySource = getLinksBySource(links);
    const visited = {};
    // the recursive bit
    const dfs = vertex => {
        if (!vertex) return null;
        visited[vertex] = true;
        process(vertex);
        getBySource(vertex).forEach(link => {
            const neighbor = link[1];
            if (!visited[neighbor]) {
                return dfs(neighbor);
            }
        })
    }
    dfs(start);
};

export function Edges() {
    const linkArray = [];
    const add = (src, tgt, wgt) => {
        const link = Object.freeze([src, tgt, wgt]);
        linkArray.push(link);
    };
    const getBySource = getLinksBySource(linkArray);

    return {
        add,
        clear: () => linkArray.length = 0,
        bfs: doBFS(linkArray),
        dfs: doRecursiveDFS(linkArray),
        // dfs: doRecursiveDFS(links),
        getAll: () => linkArray,
        getBySource,
        getByTarget: (tgtId) => linkArray.filter(link => link[1] === tgtId)
    };
}

// export function toAdjacencyListMap(linksArray) {
//     const theMap = new Map();
//     linksArray.forEach(link => {
//         const [src, tgt] = link;
//         const adjSet = theMap.get(src) || new Set();
//         adjSet.add(tgt);
//         theMap.set(src, adjSet);
//     });
//     theMap.forEach((key, value) => {
//         theMap.set(key, value?.values() || value);
//     })
//     return theMap;
// }
