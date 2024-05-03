//Flux/Redux-like framework that acts as a single 'store'.
// export function initState(reducerFn) {
//     if (typeof reducerFn !== "function") {
//         throw Error("Reducer function is mandatory.");
//     } //else set reducer and initialize state.

//     const STORE = {
//         state: reducerFn(undefined, {type: "" })
//     }

//     const dispatch = (type, payload) => {
//         STORE.state = reducerFn(STORE.state, {type, payload});
//     }

//     return Object.freeze({
//         dispatch,
//         get state() {
//             return Object.freeze(STORE.state);
//         }
//     });
// }
//Flux/Redux-like framework that acts as a single 'store'.
export function getStore(reducerFn) {
    if (typeof reducerFn !== "function") {
        throw Error("Reducer function is mandatory.");
    } //else set reducer and initialize state.

    const STORE = {
        state: reducerFn(undefined, {type: "" })
    }

    const dispatch = (type, payload) => {
        STORE.state = reducerFn(STORE.state, {type, payload});
    }

    const advise = (type, payload = {}) => {
        if (payload?.constructor === Object || payload?.constructor === Array) {
            STORE.state = reducerFn(STORE.state, {type, ...payload});
        } else {
            STORE.state = reducerFn(STORE.state, {type, payload});
        }
    }

    const getState = () => {
        return Object.freeze(STORE.state); //return a copy?
    }

    return Object.freeze({ dispatch, advise, getState });
}
