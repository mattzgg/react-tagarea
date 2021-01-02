export default class Dimension {
    constructor(width, height) {
        this.width = width || 0;
        this.height = height || 0;
    }

    getWidth() {
        return this.width;
    }

    setWidth(width) {
        this.width = width;
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        this.height = height;
    }

    add(dimension) {
        return new Dimension(
            this.getWidth() + dimension.getWidth(),
            this.getHeight() + dimension.getHeight()
        );
    }

    equals(dimension) {
        const self = this;

        return (
            dimension instanceof Dimension &&
            self.width === dimension.width &&
            self.height === dimension.height
        );
    }
}
