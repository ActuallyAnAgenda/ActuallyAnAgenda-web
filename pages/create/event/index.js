import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import EventForm from "../../../utils/components/forms/eventForm";

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
    return (
        <div className={'fullscreen'}>
            <title>New Project</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"New Event"}/>
                <Divider/>
                <EventForm authInfo={authState} setError={setError}/>
                {errorMessage}
            </div>
        </div>
    );
}
