import React from "react";
import {auth, db} from "../../firebase/firebase";


class SignupForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: '', email: '', password: '', submitted: false};
        this.onSubmit = this.onSubmit.bind(this);
        this.onAnonymousSubmit = this.onAnonymousSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

        if (this.state.submitted) return;
        this.setState({submitted: true});
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
            const userDoc = db.collection("users").doc(user.user.uid);
            userDoc.set({
                username: this.state.username,
            }).then(() => {
                console.log("Document successfully written!");
                window.location.replace("/")
            })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    this.setState({submitted: false});
                });
        }).catch((error) => {
            this.props.setError(error.message);
            this.setState({submitted: false});
        })

    }

    onAnonymousSubmit(event) {
        event.preventDefault();
        if (this.state.submitted) return;
        this.setState({submitted: true});
        auth.signInAnonymously()
            .then(() => {
                // Signed in..
                const unsubscribe = auth.onAuthStateChanged((user) => {
                    const authStateChanged = async (user) => {
                        if (user) {
                            // User is signed in, see docs for a list of available properties
                            // https://firebase.google.com/docs/reference/js/firebase.User
                            const userDoc = db.collection("users").doc(user.uid);
                            await userDoc.set({
                                username: 'Anonymous User',
                            }).then(() => {
                                console.log("Document successfully written!");
                                window.location.replace("/")
                            })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            // ...
                        } else {
                            // User is signed out
                            // ...
                            console.log("should never happen");
                        }
                    }
                    authStateChanged(user).then(() => unsubscribe());
                });
            }).catch((error) => {
            this.props.setError(error.message);
            this.setState({submitted: false});
        })
    }

    render() {
        return (
            <>
                <form className={'form'} onSubmit={this.onSubmit}>
                    <input required className={'top-input-offset'} type="text" minLength={3}
                           maxLength={30}
                           onChange={(evt) => this.setState({username: evt.target.value})}
                           placeholder={"Display Name"}/>
                    <input required type="email"
                           onChange={(evt) => this.setState({email: evt.target.value})} placeholder={"Email"}/>
                    <input required type="password"
                           onChange={(evt) => this.setState({password: evt.target.value})} placeholder={"Password"}/>
                    <input type="submit" className={'submit'} value="Sign Up"/>
                </form>
                <button className={'button'} onClick={this.onAnonymousSubmit}>Or... Sign Up Anonymously</button>
            </>
        );
    }
}

export default SignupForm;