import useFirebaseAuth, {FINISHED} from "/utils/firebase/auth";
import {Divider, Error, Title} from "/utils/components/utils";
import GlobalHeader from "/utils/components/header";
import React, {useState} from "react";
import TrayItem from "../../utils/components/trayItem";
import {deleteProject} from "../../utils/taskHandler";
import {generateSchedule} from "../../utils/schedule/main";

export default function Profile() {
    const auth = useFirebaseAuth();
    const [error, setError] = useState(null);

    if (auth.loading !== FINISHED) return null;

    if (auth.authUser == null) {
        window.location.href = "/login";
        return null;
    }

    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }


    const projects = auth.userData.projects;
    const projectList = Object.keys(projects).length > 0? <div className={"main-task-menu vertical-menu"}>{Object.keys(projects).map((key, index) => {
        const id = key;
        const name = projects[key].name;
        const description = projects[key].description;
        const due = new Date(projects[key].due).toString();
        const minutes = projects[key].minutes;
        return (<TrayItem key={id} id={id} name={name} description={description} path={'/create/project/'} timeline={`Due Date: ${due}, Minutes Required: ${minutes}`}/>)
    })}</div>: <p>You have no projects added!</p>;

    const events = auth.userData.events;
    const eventList = Object.keys(events).length > 0? <div className={"main-task-menu vertical-menu"}>{Object.keys(events).map((key, index) => {
        const id = key;
        const name = events[key].name;
        const description = events[key].description;
        const start = new Date(events[key].start).toString();
        const end = new Date(events[key].end).toString();
        return (<TrayItem key={id} id={id} name={name} description={description} path={'/create/event/'} timeline={`Starts at: ${start}, Ends at ${end}`}/>)
    })}</div>: <p>You have no events added!</p>;

    const hasEvents = Object.keys(projects).length > 0 || Object.keys(events).length > 0;

    const button = hasEvents? (<button onClick={(evt) => {
        evt.preventDefault();
        generateSchedule(auth.authUser.uid, auth.userData.projects, auth.userData.events).then(() => {
            window.location.replace("/")
        })
    }}className={'button'}>Generate Schedule!</button>): <></>;

    return (
        <div className={'fullscreen'}>
            <title>Home</title>
            <GlobalHeader authInfo={auth}/>
            <div className={'content'}>
                <Title name={`${auth.userData.username}'s Projects`}/>
                <Divider/>
                {projectList}
                <Title name={`${auth.userData.username}'s Events`}/>
                <Divider/>
                {eventList}
                {button}
                {errorMessage}
            </div>
        </div>
    );
}
