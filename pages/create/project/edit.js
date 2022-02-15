import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import {deleteProject, loadPrevState} from "../../../utils/taskHandler";
import {db} from "../../../utils/firebase/firebase";
import Form from "../../../utils/components/forms/form";
import {projectForm} from "../../../utils/components/forms/formConstants";

export default function Project() {
    const authState = useFirebaseAuth();

    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    const slug = window.sessionStorage.getItem('edit-project');
    if (authState.userData.projects[slug] == null) {
        window.location.href = "/create/project";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    const prevState = loadPrevState(slug, authState.userData.projects[slug]);
    const onSubmit = (state, onFail) => {
        db.collection("users")
            .doc(authState.authUser.uid)
            .collection("projects")
            .doc(prevState.docID).set({
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
            <title>Edit Project</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Edit Project"}/>
                <Divider/>
                <Form inputs={projectForm} submit={onSubmit} message={"Edit Project!"} prevState={prevState}/>
                <button onClick={(evt) => {
                    evt.preventDefault();
                    deleteProject(authState.authUser.uid, slug).then(() => {
                        window.location.replace("/user")
                    })
                }} className={'button'}>Or... Remove Task
                </button>
                {errorMessage}
            </div>

        </div>
    );

}
