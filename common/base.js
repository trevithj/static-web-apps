/* Global object that implements:
 * 1- a diy Flux/Redux-based framework.
 * 2- a mediator one-to-one messaging system.
 * 3- a simple global value namespacer handler.
 **/
const BASE = {};

//Flux/Redux-like framework that acts as a single 'store'.
(function () {
  var state, reduce;

  BASE.initState = (reducerFn) => {
    if (typeof reducerFn !== "function") {
      throw Error("Reducer function is mandatory.");
    } //else set reducer and initialize state.
    reduce = reducerFn;
    BASE.dispatch("");
  }

  BASE.dispatch = (type, payload) => {
    state = reduce(state, {type, payload});
    console.groupCollapsed("DISPATCH:" + type);
    console.log("Payload: ", payload);
    console.log("State: ", state);
    console.groupEnd();
    BASE.send("STATE_CHANGED", state);
  }

  BASE.getState = () => {
    return state;
  }
}());

// Mediation methods, to allow messages to be passed between
// arbitrary nodes: one-to-one only.
// This is like pub/sub, but enforces a single subscriber.
// To unsubscribe from a subject, set an empty getterFn.
(function () {
  const listeners = {};

  BASE.send = (subject, message) => {
    var listenFn = listeners[subject];
    if (typeof listenFn === "function") {
      listenFn(message);
    }
  }

  BASE.listen = (subject, getterFn) => {
    listeners[subject] = getterFn;
  }
}());


// Namespaces global values, so different scripts can pass values
// to each other. Names must be unique across the applicaton.
// Use as a setter: BASE.value("XYZ", 123);
// Use as a getter: var xyz = BASE.value("XYZ");
// Can't 'unset' a value. Use BASE.value("XYZ", null) or similar instead.
(function () {
  const values = {};

  BASE.value = (name, val) => {
    if (val !== undefined) {
      values[name] = val;
    }
    return values[name];
  }
}());
