import assert from "assert";
import {getStore} from "../store.js";

describe("getStore", () => {
    function reducer(state = [], action) {
        return [action, ...state];
    };
    const store = getStore(reducer);
    const state = {init: store.getState()};

    it("should process advise actions as expected", () => {
        assert.equal(state.init[0].type, "");

        store.advise("test", 123);
        state.temp = store.getState();
        assert.equal(state.temp[0].type, "test");
        assert.equal(state.temp[0].payload, 123);

        store.advise("spread", {abc: 123, xyz: "yes"});
        state.temp = store.getState();
        assert.equal(state.temp[0].type, "spread");
        assert.equal(state.temp[0].abc, 123);
        assert.equal(state.temp[0].xyz, "yes");
    });

    it("should process advise actions with no payload", () => {
        store.advise("no-payload");
        state.temp = store.getState();
        state.keys = Object.keys(state.temp[0]);
        assert(state.keys.length === 1);
        assert.equal(state.keys[0], "type");
    })

    it("should process dispatch actions as expected", () => {
        store.dispatch("no-spread", {abc: 123, xyz: "yes"});
        state.temp = store.getState();
        assert.equal(state.temp[0].type, "no-spread");
        assert.equal(state.temp[0].payload.abc, 123);
        assert.equal(state.temp[0].payload.xyz, "yes");
    })
})