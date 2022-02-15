import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import Form from "../../../utils/components/forms/form";
import {projectForm} from "../../../utils/components/forms/formConstants";
import {db} from "../../../utils/firebase/firebase";

export default function Project() {

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
            .collection("projects")
            .add({
                name: state.name,
                description: state.description,
                minutes: state.minutes,
                due: new Date(state.due).getTime()
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
                <Title name={"New Project"}/>
                <Divider/>
                <Form inputs={projectForm} submit={onSubmit} message={"New Project!"}/>
                {errorMessage}
            </div>
        </div>
    );
}
