import assert from "assert";
import {Edges} from "../edges.js";

describe("Graph links", () => {
    const links = Edges();
    links.add("a", "b");
    links.add("a", "c");
    links.add("d", "c");
    links.add("b", "d");

    it("should add links as expected", () => {
        const theLinks = links.getAll();
        assert.equal(theLinks.length, 4);
        const [src, tgt] = theLinks[0];
        assert.equal(src, "a");
        assert.equal(tgt, "b");
    })

    it("should return immutable links", () => {
        const theLinks = links.getAll();
        assert.throws(() => {
            theLinks[0][0] = "zzz";
        }, {
            name: "TypeError",
            message: "Cannot assign to read only property '0' of object '[object Array]'"
        });
    })

    it("should return links by source", () => {
        const list1 = links.getBySource("a");
        const list2 = links.getBySource("d");
        // assert(list.length, 2);
        const srcs1 = list1.map(link => link[0]);
        const srcs2 = list2.map(link => link[0]);
        assert.equal(srcs1.join(","), "a,a");
        assert.equal(srcs2.join(","), "d");
    })

    it("should return links by target with correct sources", () => {
        const list1 = links.getByTarget("c");
        const list2 = links.getByTarget("a");

        const srcs1 = list1.map(link => link[0]);
        const srcs2 = list2.map(link => link[0]);
        assert.equal(srcs1.join(","), "a,d");
        assert.equal(srcs2.join(","), "");
    })

    it("should perform BFS of nodes", () => {
        function getProcessFn(a) {
            return vertex => a.push(vertex);
        }
        const list1 = [];
        const list2 = [];
        links.bfs("a", getProcessFn(list1));
        links.bfs("d", getProcessFn(list2));

        assert.equal(list1.join(","), "a,b,c,d");
        assert.equal(list2.join(","), "d,c");
    })

    it("should perform DFS of nodes", () => {
        function getProcessFn(a) {
            return vertex => a.push(vertex);
        }
        const list1 = [];
        const list2 = [];
        links.dfs("a", getProcessFn(list1));
        links.dfs("d", getProcessFn(list2));

        // assert.equal(JSON.stringify(list1), '["a","b","d","c"]');
        // assert.equal(JSON.stringify(list1), '[["a","b"],["b","d"],["a","c"]]');
        assert.equal(list1.join(","), "a,b,d,c");
        // assert.equal(JSON.stringify(list2), '[["d","c"]]');
        assert.equal(list2.join(","), "d,c");
    })

})

describe("Graph links clear", () => {
    it("should clear the links", () => {
        const links = Edges();
        links.add("a", "b");
        links.add("a", "c");
        
        assert.equal(links.getAll().length, 2);
        links.clear();
        assert.equal(links.getAll().length, 0);
        
        links.add("a", "d");
        assert.equal(links.getAll().length, 1);
    })
})
