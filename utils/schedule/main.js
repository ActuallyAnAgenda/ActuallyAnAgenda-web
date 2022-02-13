import {DynamicTask} from "./dynamicTask";
import {RecurringTask} from "./recurringTask";
import {StaticTask} from "./staticTask";
import {MinPointParabolaQuery} from "./convex-hull-trick/query";
import {Parabola} from "./convex-hull-trick/parabola";
import {db} from "../firebase/firebase";

const CONVERSION_FACTOR = 15 * 1000 * 60;
const MILLIS_IN_DAY = 1000 * 24 * 60 * 60;

export async function generateSchedule(uid, rawProjects, rawEvents, setError) {
    let preferences = [], staticTasks = [], dynamicTasks = [];
    try {
        preferences.push(new RecurringTask(new Date("2022-03-05T00:00").getTime(), epochFromMinutes(60 * 8))); // 12 - 8 sleep
        preferences.push(new RecurringTask(new Date("2022-03-05T09:00").getTime(), epochFromMinutes(15))); // breakfast at 9am
        preferences.push(new RecurringTask(new Date("2022-03-05T13:30").getTime(), epochFromMinutes(15))); // lunch at 1:30
        preferences.push(new RecurringTask(new Date("2022-03-05T19:30").getTime(), epochFromMinutes(15))); // dinner at 7

        for (let ID in rawProjects) {
            let project = rawProjects[ID];
            dynamicTasks.push(new DynamicTask(ID, epochFromMinutes(project.minutes), project.due));
        }

        for (let ID in rawEvents) {
            let event = rawEvents[ID];
            staticTasks.push(new StaticTask(ID, event.start, event.end));
        }
    } catch (e) {
        setError(e.message);
        return;
    }
    const optimalK = 2;
    const result = partitionDynamicTasks(optimalK, dynamicTasks, staticTasks, preferences);
    if (result.success) {
        const schedule = result.result;
        const userDoc = db.collection("users").doc(uid);
        await userDoc.update({
            schedule: schedule.map(x => ({name: rawProjects[x.ID].name, ID: x.ID, start: x.start, end: x.end}))
        })
        window.location.replace("/");
    } else {
        setError(result.message);
    }
}

function epochToIntervalTime(epoch) {
    return (epoch / CONVERSION_FACTOR) | 0;
}

function intervalToEpochTime(interval) {
    return interval * CONVERSION_FACTOR;
}

function convertAbsoluteToScheduleTime(interval, scheduleStart) {
    return interval - scheduleStart;
}

function epochFromMinutes(cnt) {
    return cnt * 60 * 1000;
}

function binaryStringToBoolArray(S) {
    let ret = [];
    for (let i = 0; i < S.length; i++) {
        ret.push(S.charAt(i) === '1');
    }
    return ret;
}

function boolArrayToBinaryString(b) {
    let ret = [];
    for (let i = 0; i < b.length; i++) {
        ret.push(b[i] ? 1 : 0);
    }
    return ret.join("");
}

function calcMinCost(S, K) {
    let binaryArr = binaryStringToBoolArray(S);
    let pref = Array(S.length + 1).map(Number.call, Number);

    pref[S.length - 1] = binaryArr[S.length - 1];
    for (let i = S.length - 2; i >= 0; i--) {
        pref[i] = pref[i + 1] + binaryArr[i];
    }

    let N = S.length;
    let dp = [];
    let prev = [];
    for (let i = 0; i < S.length; i++) {
        let i0 = [];
        let i1 = [];
        for (let j = 0; j < pref[0] + 1; j++) {
            i0.push([0, 0]);
            i1.push([0, 0]);
        }
        dp.push(i0);
        prev.push(i1);
    }

    let zeroSuffixes = [];
    for (let i = 0; i <= N; i++) zeroSuffixes.push(new MinPointParabolaQuery(pref[0] + 1, true));
    zeroSuffixes[N].insert(new Parabola(N - K, 0, N));
    // initializing dp[i][0][0]

    for (let i = N - 1; i >= 0; i--) {
        dp[i][0][0] = (N - i - K) * (N - i - K);
        prev[i][0][0] = N;
        zeroSuffixes[i].insert(new Parabola(i - K, dp[i][0][0], i));
    }

    for (let oneCount = 1; oneCount <= pref[0]; oneCount++) {
        // Calc 1 and then 0 after 1
        for (let i = N - 1; i >= 0; i--) {
            if (pref[i] < oneCount) continue;
            let par = zeroSuffixes[i + oneCount].query(i);
            dp[i][oneCount][1] = par.cost(i);
            prev[i][oneCount][1] = par.idx;
        }

        let oneSuffixes = new MinPointParabolaQuery(N, true);

        for (let i = N - 2; i >= 0; i--) {
            if (pref[i + 1] < oneCount) continue;
            // This is the suffix that corresponds to everything to the right of 'i' (The latest suffix that can be appended to)
            let leftmostIndex = i + 1;
            oneSuffixes.insert(new Parabola(leftmostIndex - K, dp[leftmostIndex][oneCount][1], leftmostIndex));

            let par = oneSuffixes.query(i);
            dp[i][oneCount][0] = par.cost(i);
            prev[i][oneCount][0] = par.idx;

            // Inserting this suffix ending with a 0 to its diagonal correspondent within the dp array
            zeroSuffixes[i + oneCount].insert(new Parabola(i - K, dp[i][oneCount][0], i));
        }
    }

    let ans = [];
    let curI = 0, curJ = pref[0], curK = dp[0][curJ][0] < dp[0][curJ][1] ? 0 : 1;

    while (curI !== N) {
        let next = prev[curI][curJ][curK];
        let dist = next - curI; // length of current subsequence
        for (let i = 0; i < dist; i++) ans.push(curK);
        curI = next;
        if (curK === 1) curJ -= dist;
        curK ^= 1;
    }
    return boolArrayToBinaryString(ans);
}

function partitionDynamicTasks(optimalK, dynamicTasks, staticTasks, recurringTasks)
{
    if (dynamicTasks.length === 0) {
        return {
            result: [],
            success: true,
            message: "Successfully Partitioned 0 tasks."
        };
    }
    //  ------------------------------ READ ME ----------------------------------
    //  To make the method more organized, ABSOLUTE TIMES will be stored in longs (15 minute intervals since Unix),
    //  and RELATIVE TIMES will be stored in ints (15 minute intervals since the HARD_START_TIME)
    //
    //  EPOCH TIMES will never be used aside from storage as tasks.
    //  ------------------------------ READ ME ----------------------------------
    dynamicTasks.sort((a, b) => a.due - b.due);
    //  All of the below variables are in Interval Time.
    const REST_FROM_CREATION = 2;
    //  The amount of 15 minute-intervals from now until the scheduler is allowed to partition tasks.
    const HARD_START_TIME = epochToIntervalTime(Date.now()) + REST_FROM_CREATION;
    // System.out.println(HARD_START_TIME);
    const HARD_END_TIME = epochToIntervalTime(dynamicTasks[dynamicTasks.length - 1].due);
    // System.out.println(HARD_END_TIME);
    if (HARD_END_TIME < HARD_START_TIME) {
        return {
            result: null,
            success: false,
            message: "All of your due-dates are prior or too close to the current time!"
        };
    }
    //  isAvailable[relativeInterval] checks if the given relative interval
    let isAvailable = Array(convertAbsoluteToScheduleTime(HARD_END_TIME, HARD_START_TIME)).fill(true);
    //  inRecurringInterval[absoluteInterval] checks if that given absolute interval is within a recurring event.
    let inRecurringInterval = Array(MILLIS_IN_DAY / CONVERSION_FACTOR).fill(false);
    //  Loops through the recurring events and updates inRecurringInterval, which is a
    //  universal array that checks for if any given interval is unavailable for partitioning due to recurring events.
    for (let i = 0; i < recurringTasks.length; i++) {
        let start = epochToIntervalTime(recurringTasks[i].startTime);
        let dur = epochToIntervalTime(recurringTasks[i].duration + CONVERSION_FACTOR - 1);
        for (let j = start; j < start + dur; j++) {
            //  If the event "overflows" to the next day, must use modulo
            inRecurringInterval[j % inRecurringInterval.length] = true;
        }
    }
    for (let i = 0; i < staticTasks.length; i++) {
        let start = epochToIntervalTime(staticTasks[i].start);
        let end = epochToIntervalTime(staticTasks[i].end + CONVERSION_FACTOR - 1);
        for (let j = Math.max(HARD_START_TIME, start); j < Math.min(HARD_END_TIME, end); j++) {
            isAvailable[convertAbsoluteToScheduleTime(j, HARD_START_TIME)] = false;
        }
    }
    for (let i = HARD_START_TIME; i < HARD_END_TIME; i++) {
        if (inRecurringInterval[i % inRecurringInterval.length]) {
            isAvailable[convertAbsoluteToScheduleTime(i, HARD_START_TIME)] = false;
        }
    }

    //  Creating a separate partitioning array with the unavailable intervals removed
    //  Firstly, index conversion arrays must be created to go back and forth
    let partitionIndex = Array(isAvailable.length).fill(0);
    let cnt = 0;
    for (let i = 0; i < isAvailable.length; i++) {
        if (isAvailable[i]) {
            partitionIndex[i] = cnt++;
        }
    }
    let originalIndex = Array(cnt).fill(0);
    for (let i = 0; i < isAvailable.length; i++) {
        if (isAvailable[i]) {
            originalIndex[partitionIndex[i]] = i;
        }
    }
    let naivePartition = Array(cnt).fill(false);
    //  Next, Attempting to create the naive partition generation -> Shoving all tasks as far back as possible
    let currentTaskIdx = dynamicTasks.length - 1;
    let sessionsRemaining = epochToIntervalTime(dynamicTasks[currentTaskIdx].duration + CONVERSION_FACTOR - 1);
    for (let i = HARD_END_TIME - 1; i >= HARD_START_TIME; i--) {
        if (sessionsRemaining === 0) {
            currentTaskIdx--;
            if (currentTaskIdx < 0) {
                break;
            }
            sessionsRemaining = epochToIntervalTime(dynamicTasks[currentTaskIdx].duration + CONVERSION_FACTOR - 1);
        }
        if (!isAvailable[convertAbsoluteToScheduleTime(i, HARD_START_TIME)] || i >= epochToIntervalTime(dynamicTasks[currentTaskIdx].due)) {
            continue;
        }
        naivePartition[partitionIndex[convertAbsoluteToScheduleTime(i, HARD_START_TIME)]] = true;
        sessionsRemaining--;
    }
    if (sessionsRemaining === 0) {
        currentTaskIdx--;
    }
    //  Barely finished partitioning - the schedule is extremely full
    if (currentTaskIdx >= 0) {
        //  Still tasks left to partition but with no room
        return {
            result: null,
            success: false,
            message: "Error: It is impossible to generate a schedule without having overdue or overlapping tasks! Please modify the tasks, events, or preferences which you have set"
        };
    }
    let fixedPartition = binaryStringToBoolArray(calcMinCost(boolArrayToBinaryString(naivePartition), optimalK));
    let result = [];
    // Assigning optimal intervals to tasks using the previous method but in reverse
    currentTaskIdx = 0;
    sessionsRemaining = epochToIntervalTime(dynamicTasks[currentTaskIdx].duration + CONVERSION_FACTOR - 1);
    for (let i = 0; i < fixedPartition.length; i++) {
        if (!fixedPartition[i]) {
            continue;
        }
        if (sessionsRemaining === 0) {
            currentTaskIdx++;
            if (currentTaskIdx === dynamicTasks.length) {
                break;
            }
            sessionsRemaining = epochToIntervalTime(dynamicTasks[currentTaskIdx].duration + CONVERSION_FACTOR - 1);
        }
        let trueTime = intervalToEpochTime(originalIndex[i] + HARD_START_TIME);
        let ID = dynamicTasks[currentTaskIdx].ID;
        if (result.length === 0) {
            //  1 interval
            result.push(new StaticTask(ID, trueTime, trueTime + CONVERSION_FACTOR));
        } else {
            let top = result[result.length - 1];
            if (top.end === trueTime) {
                result.pop();
                result.push(new StaticTask(ID, top.start, top.end + CONVERSION_FACTOR));
            } else {
                result.push(new StaticTask(ID, trueTime, trueTime + CONVERSION_FACTOR));
            }
        }
        sessionsRemaining--;
    }
    return {
        result: result,
        success: true,
        message: "Successfully Partitioned " + dynamicTasks.length + " tasks."
    };
}