import Boundary from "./boundary";
import Location from "./location";
import { getElementScrollSize } from "./mootools-dimensions";

export function calculateTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas =
        calculateTextWidth.canvas ||
        (calculateTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

export function calculateTagMaxWidth(appearanceConfig) {
    const { width, borderWidth, tagSpacing } = appearanceConfig;
    return width - 2 * borderWidth - 2 * tagSpacing;
}

export function calculateBoundary(appearanceConfig) {
    const { width, height } = appearanceConfig;
    const topLeft = new Location(0, 0);
    const bottomRight = topLeft.moveX(width).moveY(height);
    return new Boundary(topLeft, bottomRight);
}

export function calculateContentBoundary(appearanceConfig) {
    const boundary = calculateBoundary(appearanceConfig);
    const { borderWidth, tagSpacing } = appearanceConfig;
    const topLeft = boundary.topLeft
        .moveX(borderWidth, tagSpacing)
        .moveY(borderWidth, tagSpacing);
    const bottomRight = boundary.bottomRight
        .moveX(-borderWidth, -tagSpacing)
        .moveY(-borderWidth, -tagSpacing);
    return new Boundary(topLeft, bottomRight);
}

export function calculateTagBoundary(
    appearanceConfig,
    previousTagBoundary = null,
    tagSize = null
) {
    const contentBoundary = calculateContentBoundary(appearanceConfig);
    let tagLocation;
    if (!previousTagBoundary || previousTagBoundary.isPoint()) {
        tagLocation = contentBoundary.getTopLeft().copy();
    } else {
        const { tagSpacing } = appearanceConfig;
        tagLocation = previousTagBoundary.getTopRight().moveX(tagSpacing);

        if (tagLocation.x + tagSize.width > contentBoundary.getTopRight().x) {
            tagLocation = new Location(
                contentBoundary.getTopLeft().x,
                previousTagBoundary.getBottomLeft().moveY(tagSpacing).y
            );
        }
    }

    return new Boundary(
        tagLocation,
        tagSize
            ? tagLocation.moveX(tagSize.width).moveY(tagSize.height)
            : tagLocation
    );
}

export function calculateCursorLocation(
    appearanceConfig,
    lastTagBoundary,
    text
) {
    const { tagSpacing, font } = appearanceConfig;
    const contentBoundary = calculateContentBoundary(appearanceConfig);
    let cursorLocation;
    if (!lastTagBoundary || lastTagBoundary.isPoint()) {
        cursorLocation = contentBoundary.getTopLeft().copy();
    } else {
        cursorLocation = lastTagBoundary.getTopRight().moveX(tagSpacing);
        const textWidth = calculateTextWidth(text, font);
        if (cursorLocation.x + textWidth > contentBoundary.getTopRight().x) {
            cursorLocation = new Location(
                contentBoundary.getTopLeft().x,
                lastTagBoundary.getBottomLeft().moveY(tagSpacing).y
            );
        }
    }
    return cursorLocation;
}

export function calculatePaddings(appearanceConfig, lastTagBoundary, text) {
    const { borderWidth, tagSpacing } = appearanceConfig;
    const cursorLocation = calculateCursorLocation(
        appearanceConfig,
        lastTagBoundary,
        text
    );
    return {
        left: cursorLocation.moveX(-borderWidth).x,
        top: cursorLocation.moveY(-borderWidth).y,
        right: tagSpacing,
        bottom: tagSpacing,
    };
}

export function calculateMinimumHeight(appearanceConfig, textarea) {
    const { borderWidth } = appearanceConfig;
    const { y } = getElementScrollSize(textarea);
    return y + borderWidth * 2;
}
