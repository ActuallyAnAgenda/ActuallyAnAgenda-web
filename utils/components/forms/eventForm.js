import React, {useEffect, useState} from "react";
import {auth, db} from "../../firebase/firebase";

class EventForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: '', description: '', start: '', end: '', inputType1: 'text', inputType2: 'text', submitted: false, message: ''};
        this.onSubmit = this.onSubmit.bind(this);
        this.onFocus1 = this.onFocus1.bind(this);
        this.onBlur1 = this.onBlur1.bind(this);
        this.onFocus2 = this.onFocus2.bind(this);
        this.onBlur2 = this.onBlur2.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.submitted) return;
        this.setState({submitted: true});

        const authInfo = this.props.authInfo;
        const uid = authInfo.authUser.uid;

        const userDoc = db.collection("users").doc(uid);
        const events = userDoc.collection("events");

        const action = (value) => {
            if (this.props.prevState != null) {
                return events.doc(this.props.prevState.docID).set(value);
            } else {
                return events.add(value);
            }
        }

        action({
            name: this.state.name,
            description: this.state.description,
            start: this.state.start,
            end: this.state.end
        }).then(() => {
            console.log("Document successfully written!");
            window.location.replace("/user")
        }).catch((error) => {
            console.error("Error writing document: ", error);
            this.setState({submitted: false});
            this.props.setError(error.message)
        });
    }

    onFocus1(event) {
        this.setState({inputType1: "datetime-local"});
    }

    onBlur1(event) {
        if (event.target.value === "" && !event.target.validity.badInput) {
            this.setState({inputType1: "text"});
        }
    }

    onFocus2(event) {
        this.setState({inputType2: "datetime-local"});
    }

    onBlur2(event) {
        if (event.target.value === "" && !event.target.validity.badInput) {
            this.setState({inputType2: "text"});
        }
    }
    render() {
        return (
            <form className={'form'} onSubmit={this.onSubmit}>
                <input id={"name"} required className={'top-input-offset'} type="text"
                       onChange={(evt) => this.setState({name: evt.target.value})} placeholder={"Event Name"}/>
                <input id={"description"} type="text" onChange={(evt) => this.setState({description: evt.target.value})} placeholder={"Description (Optional)"}/>
                <input id={"start"} required type={this.state.inputType1} onFocus={this.onFocus1} onBlur={this.onBlur1} onChange={(evt) => this.setState({start: evt.target.value})} placeholder={"Event Start"}/>
                <input id={"end"} required type={this.state.inputType2} onFocus={this.onFocus2} onBlur={this.onBlur2} onChange={(evt) => this.setState({end: evt.target.value})} placeholder={"Event End"}/>
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
     *          start: previous start,
     *          end: previous end
     *     }
     * }
     * @param this.props.prevState.docID
     * @param this.props.prevState.value
     */
    componentDidMount() {
        if (this.props.prevState != null) {
            // Sets a default value
            this.setState({message: "Update Event!"});
            for (const id in this.props.prevState.value) {
                const v = this.props.prevState.value[id];
                document.getElementById(id).value = v;
                this.setState({[id]: v});
            }
        } else {
            this.setState({message: "Create Event!"});
        }
    }
}

export default EventForm;