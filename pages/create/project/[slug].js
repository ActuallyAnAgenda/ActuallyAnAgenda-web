import React, {useState} from "react";
import { useRouter } from 'next/router'
import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import {deleteProject, loadPrevState} from "../../../utils/taskHandler";
import ProjectForm from "../../../utils/components/forms/projectForm";

export default function Project() {
    const authState = useFirebaseAuth();
    const router = useRouter()
    const { slug } = router.query

    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    if (authState.userData.projects[slug] == null) {
        window.location.href = "/create/project";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    const prevState = loadPrevState(slug, authState.userData.projects[slug]);
    return (
        <div className={'fullscreen'}>
            <title>Edit Project</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Edit Project"}/>
                <Divider/>
                <ProjectForm prevState={prevState} authInfo={authState} setError={setError}/>
                <button onClick={(evt) => {
                    evt.preventDefault();
                    deleteProject(authState.authUser.uid, slug).then(() => {
                        window.location.replace("/user")
                    })
                }}className={'button'}>Or... Remove Task</button>
                {errorMessage}
            </div>

        </div>
    );

}
