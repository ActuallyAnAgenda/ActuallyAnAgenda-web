import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import {db} from "../../../utils/firebase/firebase";
import Form from "../../../utils/components/forms/form";
import {eventForm} from "../../../utils/components/forms/formConstants";

export default function Event() {
    const authState = useFirebaseAuth();

    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    const onSubmit = (state, onFail) => {
        db.collection("users")
            .doc(authState.authUser.uid)
            .collection("events")
            .add({
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
            <title>New Project</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"New Event"}/>
                <Divider/>
                <Form inputs={eventForm} submit={onSubmit} message={"Create Event!"}/>
                {errorMessage}
            </div>
        </div>
    );
}
