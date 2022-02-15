import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import {deleteEvent, loadPrevState} from "../../../utils/taskHandler";
import Form from "../../../utils/components/forms/form";
import {db} from "../../../utils/firebase/firebase";
import {eventForm} from "../../../utils/components/forms/formConstants";

export default function Event() {
    const authState = useFirebaseAuth();

    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    const slug = window.sessionStorage.getItem('edit-event');
    if (authState.userData.events[slug] == null) {
        window.location.href = "/create/event";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    const prevState = loadPrevState(slug, authState.userData.events[slug]);
    const onSubmit = (state, onFail) => {
        db.collection("users")
            .doc(authState.authUser.uid)
            .collection("events")
            .doc(prevState.docID).set({
            name: state.name,
            description: state.description,
            start: new Date(state.start).getTime(),
            end: new Date(state.end).getTime()
        }).then(() => {
            console.log("Document successfully written!");
            window.location.replace("/user")
        }).catch((error) => {
            console.error("Error writing document: ", error);
            onFail();
        });
    }
    return (
        <div className={'fullscreen'}>
            <title>Edit Event</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Edit Event"}/>
                <Divider/>
                <Form inputs={eventForm} submit={onSubmit} message={"Edit Event!"} prevState={prevState}/>
                <button onClick={(evt) => {
                    evt.preventDefault();
                    deleteEvent(authState.authUser.uid, slug).then(() => {
                        window.location.replace("/user")
                    })
                }} className={'button'}>Or... Remove Task
                </button>
                {errorMessage}
            </div>
        </div>
    );

}
