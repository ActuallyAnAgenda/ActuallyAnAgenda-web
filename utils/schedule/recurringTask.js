const MILLIS_IN_DAY = 1000 * 24 * 60 * 60;

export class RecurringTask {
    constructor(startTime, duration) {
        this.startTime = startTime % MILLIS_IN_DAY;
        if (duration >= MILLIS_IN_DAY || duration <= 0) {
            throw new Error("One or more of your preferences has an invalid duration.");
        }
        this.duration = duration;
    }
}