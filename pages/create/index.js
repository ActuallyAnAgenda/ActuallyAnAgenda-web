import React from "react";
import useFirebaseAuth, {FINISHED} from "../../utils/firebase/auth";
import {Divider, ButtonContainer, Title} from "../../utils/components/utils";
import GlobalHeader from "../../utils/components/header";
import ReactMarkdown from "react-markdown";

export default function Index() {
    const authState = useFirebaseAuth();
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser == null) {
        window.location.href = "/login";
        return null;
    }
    const buttons = [
        {
            name: "New Project",
            description: <ReactMarkdown>A project has a due date and estimated amount of time required to complete. The program will help allocate time efficiently so that you will be able to finish your projects.</ReactMarkdown>,
            href: '/create/project'
        },
        {
            name: "New Event",
            description: <ReactMarkdown>An event has a fixed start and end time. These are times where you must attend something and *cannot* be allocated for work on projects.</ReactMarkdown>,
            href: '/create/event'
        },
        {
            name: "Set Preferences",
            description: <ReactMarkdown>Coming soon!</ReactMarkdown>,
        }
    ];
    return (
        <div className={'fullscreen'}>
            <title>Create A Task</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Task Type"}/>
                <Divider/>
                <ButtonContainer buttons={buttons}/>
                <Divider/>
            </div>
        </div>

    );
}
