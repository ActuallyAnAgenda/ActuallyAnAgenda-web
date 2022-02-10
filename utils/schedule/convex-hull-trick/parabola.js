export class Parabola {
    /**
     * Parabola in the form, (x-h)^2 + k.
     * @param h x-position of vertex
     * @param k y-position of vertex
     * @param idx ID of the parabola
     */
    constructor(h, k, idx) {
        this.h = h;
        this.k = k;
        this.idx = idx;
    }
    cost(x) {
        return Math.pow(x - this.h, 2) + this.k;
    }

    intersect(comp) {
        return ((comp.k - this.k + (comp.h * comp.h) - (this.h * this.h)) / (2 * (comp.h - this.h)));
    }
}