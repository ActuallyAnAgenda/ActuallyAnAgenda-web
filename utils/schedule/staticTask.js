export class StaticTask {
    constructor(ID, start, end) {
        this.ID = ID;
        this.start = start;
        this.end = end;
        if (end <= start) {
            throw new Error("You cannot have events that end before they start!");
        }
    }
}