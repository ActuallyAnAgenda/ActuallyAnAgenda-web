import React, {useState} from "react";
import { useRouter } from 'next/router'
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import EventForm from "../../../utils/components/forms/eventForm";
import {deleteEvent, deleteProject, loadPrevState} from "../../../utils/taskHandler";

export default function Event() {
    const authState = useFirebaseAuth();
    const router = useRouter()
    const { slug } = router.query

    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    if (authState.userData.events[slug] == null) {
        window.location.href = "/create/event";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    const prevState = loadPrevState(slug, authState.userData.events[slug]);
    return (
        <div className={'fullscreen'}>
            <title>Edit Event</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Edit Event"}/>
                <Divider/>
                <EventForm prevState={prevState} authInfo={authState} setError={setError}/>
                <button onClick={(evt) => {
                    evt.preventDefault();
                    deleteEvent(authState.authUser.uid, slug).then(() => {
                        window.location.replace("/user")
                    })
                }}className={'button'}>Or... Remove Task</button>
                {errorMessage}
            </div>
        </div>
    );

}
