// Misc helper functions
export const select = (selector, el = document) => el.querySelector(selector);

export const selectAll = (selector, el = document) => el.querySelectorAll(selector);

export const makeElement = (type, className) => {
    const el = document.createElement(type);
    if (className) el.classList.add(className);
    return el;
}

export const makeSVGElement = type => document.createElementNS('http://www.w3.org/2000/svg', type);

export function getSelectors(element) {
    return Object.freeze({
        first: selector => select(selector, element),
        all: selector => selectAll(selector, element),
        byAttrib: (name, value) => selectAll(`[${name}="${value}"]`, element),
    });
}
