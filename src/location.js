export default class Location {
    static MOVE_DIRECTION_X = 1;

    static MOVE_DIRECTION_Y = 2;

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
    }

    copy() {
        return new Location(this.getX(), this.getY());
    }

    move(direction, ...offsets) {
        const totalOffset = offsets.reduce(
            (accumulator, currentValue) => accumulator + currentValue
        );

        if (direction === Location.MOVE_DIRECTION_X) {
            return new Location(this.getX() + totalOffset, this.getY());
        }
        if (direction === Location.MOVE_DIRECTION_Y) {
            return new Location(this.getX(), this.getY() + totalOffset);
        }
        throw new Error(`Invalid move direction${direction}`);
    }

    moveX(...offsets) {
        return this.move(Location.MOVE_DIRECTION_X, ...offsets);
    }

    moveY(...offsets) {
        return this.move(Location.MOVE_DIRECTION_Y, ...offsets);
    }

    getDifferences(location) {
        return {
            width: this.x - location.x,
            height: this.y - location.y,
        };
    }
}
