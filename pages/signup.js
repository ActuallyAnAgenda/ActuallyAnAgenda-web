import React, {useState} from "react";
import useFirebaseAuth, {FINISHED} from "../utils/firebase/auth";
import {Divider, Error, Title} from "../utils/components/utils";
import GlobalHeader from "../utils/components/header";
import SignupForm from "../utils/components/forms/signupForm";

export default function SignUp() {
    const authState = useFirebaseAuth();
    const [error, setError] = useState(null);
    if (authState.loading !== FINISHED) return null;
    if (authState.authUser != null) {
        window.location.href = "/";
        return null;
    }
    let errorMessage = <></>;
    if (error != null) {
        errorMessage = <Error error={error}/>;
    }
    return (
        <div className={'fullscreen'}>
            <title>Sign Up</title>
            <GlobalHeader authInfo={authState}/>
            <div className={'content'}>
                <Title name={"Sign Up"}/>
                <Divider/>
                <SignupForm setError={setError}/>
                {errorMessage}
            </div>
        </div>

    );
}
