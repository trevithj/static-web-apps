import {publish, subscribe} from "./pubsub.js";
import {getStore} from "./store.js";
import * as Selectors from "./selectors.js";

/* Global object that implements:
 * 1- a diy Flux/Redux-based framework.
 * 2- a mediator one-to-one messaging system.
 * 3- a simple global value namespacer handler.
 **/
const BASE = {};

BASE.initState = (reducerFn) => {
    const {dispatch, getState} = getStore(reducerFn);
    BASE.getState = getState;

    BASE.dispatch = (type, payload) => {
        dispatch(type, payload);
        const state = getState();
        if (BASE.logging) {
            console.groupCollapsed("DISPATCH:" + type);
            console.log("Payload: ", payload);
            console.log("State: ", state);
            console.groupEnd();
        }
        BASE.send("STATE_CHANGED", state);
    }
}

// Mediation methods, to allow messages to be passed between
// arbitrary nodes: one-to-one only.
// This is like pub/sub, but enforces a single subscriber. More like a broker.
// To unsubscribe from a subject, pass an empty listenFn to BASE.listen.
const listeners = {};

BASE.send = (subject, message) => {
    var listenFn = listeners[subject];
    if (listenFn && typeof listenFn === "function") {
        listenFn(message);
    }
    if (BASE.logging) {
        console.log({subject, message});
    }
}

BASE.listen = (subject, listenFn) => {
    if (BASE.logging) {
        console.log({subject, listenFn});
    }
    if (typeof listenFn === 'function') {
        listeners[subject] = listenFn;
    } else {
        delete listeners[subject];
    }
}

// Proper PubSub methods, to allow broadcasting messages to multiple nodes.
// Wraps the pubsub functions with additional logging.

BASE.pub = (subject, message) => {
    publish(subject, message);
    if (BASE.logging) {
        console.log({subject, message});
        // console.log({subject, message, subs: subscribers.length});
    }
}

BASE.sub = (subject, subFn) => {
    if (BASE.logging) {
        console.log({subject, subFn});
    }
    return subscribe(subject, subFn);
}

// Namespaces global values, so different scripts can pass values
// to each other. Names must be unique across the applicaton.
// Use as a setter: BASE.value("XYZ", 123);
// Use as a getter: var xyz = BASE.value("XYZ");
// Can't 'unset' a value. Use BASE.value("XYZ", null) or similar instead.
const values = {};

BASE.value = (name, val) => {
    if (val !== undefined) {
        values[name] = val;
    }
    return values[name];
}

// Misc helper functions
BASE.select = Selectors.select;
BASE.selectAll = Selectors.selectAll;
BASE.createEl = Selectors.makeElement;
BASE.createElSVG = Selectors.makeSVGElement;

export default BASE;
