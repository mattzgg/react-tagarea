export default class Boundary {
    constructor(topLeft, bottomRight) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    getWidth() {
        return this.bottomRight.x - this.topLeft.x;
    }

    getHeight() {
        return this.bottomRight.y - this.topLeft.y;
    }

    getTopLeft() {
        return this.topLeft;
    }

    getTopRight() {
        return this.getTopLeft().moveX(this.getWidth());
    }

    getBottomLeft() {
        return this.getBottomRight().moveX(-this.getWidth());
    }

    getBottomRight() {
        return this.bottomRight;
    }

    /**
     * A boundary is a point if its top-left and bottom-right vertices
     * use the same location.
     */
    isPoint() {
        return this.getWidth() === 0 && this.getHeight() === 0;
    }
}
