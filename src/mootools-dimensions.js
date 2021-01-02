(() => {
    /**
     * This module copies functions from mootools-core (https://github.com/mootools/mootools-core)
     * which are used to calculate size and scroll size of an element.
     */
})();

function getElementTag(element) {
    return element.tagName.toLowerCase();
}

function isBody(element) {
    const tag = getElementTag(element);
    return /^(?:body|html)$/i.test(tag);
}

function getCompatElement(object) {
    let doc;
    if (object instanceof Document) {
        doc = object;
    } else if (object instanceof Window) {
        doc = object.document;
    } else {
        throw new Error(
            "Invalid object. It must be either the global window or document."
        );
    }
    return !doc.compatMode || doc.compatMode === "CSS1Compat"
        ? doc.html
        : doc.body;
}

function getDocument(element) {
    return element.ownerDocument;
}

function getWindow(element) {
    return getDocument(element).window;
}

function getWindowSize(element) {
    const window = getWindow(element);
    const doc = getCompatElement(window);
    return {
        x: doc.clientWidth,
        y: doc.clientHeight,
    };
}

function getWindowScrollSize(element) {
    const window = getWindow(element);
    const doc = getCompatElement(window);
    const min = getWindowSize(element);
    const { body } = getDocument(element);
    return {
        x: Math.max(doc.scrollWidth, body.scrollWidth, min.x),
        y: Math.max(doc.scrollHeight, body.scrollHeight, min.y),
    };
}

function svgCalculateSize(el) {
    const gCS = window.getComputedStyle(el);
    const bounds = { x: 0, y: 0 };
    const heightComponents = [
        "height",
        "paddingTop",
        "paddingBottom",
        "borderTopWidth",
        "borderBottomWidth",
    ];
    const widthComponents = [
        "width",
        "paddingLeft",
        "paddingRight",
        "borderLeftWidth",
        "borderRightWidth",
    ];

    heightComponents.each((css) => {
        bounds.y += parseFloat(gCS[css]);
    });
    widthComponents.each((css) => {
        bounds.x += parseFloat(gCS[css]);
    });
    return bounds;
}

export function getElementSize(element) {
    if (isBody(element)) return getWindowSize(element);

    if (!window.getComputedStyle)
        return { x: element.offsetWidth, y: element.offsetHeight };

    const tag = getElementTag(element);
    if (tag === "svg") return svgCalculateSize(element);

    try {
        const bounds = element.getBoundingClientRect();
        return { x: bounds.width, y: bounds.height };
    } catch (e) {
        return { x: 0, y: 0 };
    }
}

export function getElementScrollSize(element) {
    if (isBody(element)) return getWindowScrollSize(element);
    return { x: element.scrollWidth, y: element.scrollHeight };
}
