export class MinPointParabolaQuery {
    /**
     * Default constructor
     * @param maxSizeBuffer max number of objects inserted at a time
     * @param reverse whether to query in increasing (false) or decreasing order
     */
    constructor(maxSizeBuffer, reverse) {
        this.hull = Array(maxSizeBuffer).fill(null);
        this.reverse = reverse;
        this.ls = 0;
        this.rs = 0;
    }

    insert(par) {
        while (this.rs - this.ls > 1 && (this.hull[this.rs - 2].intersect(this.hull[this.rs - 1]) > this.hull[this.rs - 2].intersect(par)) ^ this.reverse) this.rs--;
        this.hull[this.rs++] = par;
    }

    query(x) {
        while (this.rs - this.ls > 1 && this.hull[this.ls].cost(x) >= this.hull[this.ls + 1].cost(x)) this.ls++;
        return this.hull[this.ls];
    }
}