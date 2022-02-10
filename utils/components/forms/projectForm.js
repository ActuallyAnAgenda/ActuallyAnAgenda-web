import React, {useEffect, useState} from "react";
import {auth, db} from "../../firebase/firebase";

class ProjectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: '', description: '', minutes: '', due: '', inputType: 'text', submitted: false, message: ''};
        this.onSubmit = this.onSubmit.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.submitted) return;
        this.setState({submitted: true});

        const authInfo = this.props.authInfo;
        const uid = authInfo.authUser.uid;

        const userDoc = db.collection("users").doc(uid);
        const projects = userDoc.collection("projects");

        const action = (value) => {
            if (this.props.prevState != null) {
                return projects.doc(this.props.prevState.docID).set(value);
            } else {
                return projects.add(value);
            }
        }

        action({
            name: this.state.name,
            description: this.state.description,
            minutes: this.state.minutes,
            due: new Date(this.state.due).getTime()
        }).then(() => {
            console.log("Document successfully written!");
            window.location.replace("/user")
        }).catch((error) => {
            console.error("Error writing document: ", error);
            this.setState({submitted: false});
        });
    }

    onFocus(event) {
        this.setState({inputType: "datetime-local"});
    }

    onBlur(event) {
        const blank = event.target.value === "" && !event.target.validity.badInput;
        if (blank) {
            this.setState({inputType: "text"});
        }
    }
    render() {
        // Can set default value like `value = "something"` for future task updates

        return (
            <form className={'form'} onSubmit={this.onSubmit}>
                <input id={"name"} required className={'top-input-offset'} type="text"
                       onChange={(evt) => this.setState({name: evt.target.value})} placeholder={"Project Name"}/>
                <input id={"description"} type="text" onChange={(evt) => this.setState({description: evt.target.value})} placeholder={"Description (Optional)"}/>
                <input id={"minutes"} required min={0} type="number" onChange={(evt) => this.setState({minutes: evt.target.value})} placeholder={"Minutes Required"}/>
                <input id={"due"} required type={this.state.inputType} onFocus={this.onFocus} onBlur={this.onBlur} onChange={(evt) => this.setState({due: evt.target.value})} placeholder={"Due Date"}/>
                <input type="submit" className={'submit'} value={this.state.message}/>
            </form>
        );
    }

    /**
     * Accepts a "previous state"
     * @param this.props.prevState == {
     *     docID: (the ID of the previous document in Firestore),
     *     value: {
     *          name: previous name,
     *          description: previous description,
     *          minutes: previous minutes,
     *          due: previous due date
     *     }
     * }
     * @param this.props.prevState.docID
     * @param this.props.prevState.value
     */
    componentDidMount() {
        if (this.props.prevState != null) {
            // Sets a default value
            this.setState({message: "Update Project!"});
            for (const id in this.props.prevState.value) {
                let v = this.props.prevState.value[id];
                if (id === 'due') {
                    const d = new Date(v);
                    v = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                }
                document.getElementById(id).value = v;
                this.setState({[id]: v});
            }
            this.setState({inputType: "datetime-local"});
        } else {
            this.setState({message: "Create Project!"});
        }
    }
}

export default ProjectForm;