import { publish, subscribe } from "./pubsub.js";
/* Global object that implements:
 * 1- a diy Flux/Redux-based framework.
 * 2- a mediator one-to-one messaging system.
 * 3- a simple global value namespacer handler.
 **/
const BASE = {};

//Flux/Redux-like framework that acts as a single 'store'.
let state, reduce;

BASE.initState = (reducerFn) => {
    if (typeof reducerFn !== "function") {
        throw Error("Reducer function is mandatory.");
    } //else set reducer and initialize state.
    reduce = reducerFn;
    BASE.dispatch("");
}

BASE.dispatch = (type, payload) => {
    state = reduce(state, {type, payload});
    if (BASE.logging) {
        console.groupCollapsed("DISPATCH:" + type);
        console.log("Payload: ", payload);
        console.log("State: ", state);
        console.groupEnd();
    }
    BASE.send("STATE_CHANGED", state);
}

BASE.getState = () => {
    return Object.freeze(state); //return a copy?
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
BASE.select = (selector, el = document) => el.querySelector(selector);
BASE.selectAll = (selector, el = document) => el.querySelectorAll(selector);
BASE.createEl = (type, className) => {
    const el = document.createElement(type);
    if (className) el.classList.add(className);
    return el;
}
BASE.createElSVG = type => document.createElementNS('http://www.w3.org/2000/svg', type);

export default BASE;
