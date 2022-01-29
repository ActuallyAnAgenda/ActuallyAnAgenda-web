import {db} from "./firebase/firebase";

export function loadPrevState(id, thing) {
    return {
        docID: id,
        value: thing
    }
}

export async function deleteProject(uid, docID) {
    const userDoc = db.collection("users").doc(uid);
    const projects = userDoc.collection("projects");
    await projects.doc(docID).delete();
}

export async function deleteEvent(uid, docID) {
    const userDoc = db.collection("users").doc(uid);
    const events = userDoc.collection("events");
    await events.doc(docID).delete();
}
