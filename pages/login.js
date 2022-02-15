import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "../utils/firebase/auth";
import {Divider, Error, Title} from "../utils/components/utils";
import GlobalHeader from "../utils/components/header";
import {loginForm} from "../utils/components/forms/formConstants";
import Form from "../utils/components/forms/form";
import {auth} from "../utils/firebase/firebase";

export default function Login() {

    const authInfo = useFirebaseAuth();
    const [error, setError] = useState(null);
    if (authInfo.loading !== FINISHED) return null;
    if (authInfo.authUser != null) {
        window.location.href = "/";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    return (
        <div className={'fullscreen'}>
            <title>Login</title>
            <GlobalHeader authInfo={authInfo}/>
            <div className={'content'}>
                <Title name={"Login"}/>
                <Divider/>
                <Form inputs={loginForm} message={"Log In"} submit={(state, onFail) => {
                    auth.signInWithEmailAndPassword(state.email, state.password).then((user) => {
                        window.location.replace("/");
                    }).catch((error) => {
                        setError(error.message);
                        onFail();
                    })
                }}/>
                {errorMessage}
            </div>
        </div>
    );
}
