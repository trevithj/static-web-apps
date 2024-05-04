const getLinksBySource = links => theSrc => links.filter(link => link[0] === theSrc);

function processLink(visited, stackOrQueue) {
    return link => {
        const neighbor = link[1];
        if (!visited[neighbor]) {
            visited[neighbor] = true;
            stackOrQueue.push(neighbor);
        }
    }
}
const doBFS = links => start => {
    const getBySource = getLinksBySource(links);
    const queue = [start];
    const result = [];
    const visited = {start: true};
    let currentVertex;
    while (queue.length) {
        currentVertex = queue.shift();
        result.push(currentVertex);
        getBySource(currentVertex).forEach(processLink(visited, queue));
    }
    return result;
}

// iterative version
export const doDFS = links => start => {
    const getBySource = getLinksBySource(links);
    const stack = [start];
    const result = [];
    const visited = {[start]: true};

    while (stack.length) {
        const vertex = stack.pop();
        result.push(vertex);
        getBySource(vertex).reverse().forEach(processLink(visited, stack));
    }
    return result;
}

// recursive version
export const doRecursiveDFS = links => start => {
    const getBySource = getLinksBySource(links);
    const result = [];
    const visited = {};
    // the recursive bit
    const dfs = vertex => {
        if (!vertex) return null;
        visited[vertex] = true;
        result.push(vertex);
        getBySource(vertex).forEach(link => {
            const neighbor = link[1];
            if (!visited[neighbor]) {
                return dfs(neighbor);
            }
        })
    }
    dfs(start);
    return result;
};


export function Links() {
    const links = [];
    const add = (src, tgt, wgt) => {
        const link = Object.freeze([src, tgt, wgt]);
        links.push(link);
    };
    const getBySource = getLinksBySource(links);

    const instance = {
        add,
        bfs: doBFS(links),
        dfs: doRecursiveDFS(links),
        // dfs: doRecursiveDFS(links),
        getAll: () => links,
        getBySource,
        getByTarget: (tgtId) => links.filter(link => link[1] === tgtId)
    }
    return instance;
}