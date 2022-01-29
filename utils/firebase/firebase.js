import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import * as ReactDOM from "react-dom";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBm2m4FM61C-VrKC3lRLT_8Cq0GxgblrGg",
    authDomain: "classified-bfa24.firebaseapp.com",
    databaseURL: "https://classified-bfa24-default-rtdb.firebaseio.com",
    projectId: "classified-bfa24",
    storageBucket: "classified-bfa24.appspot.com",
    messagingSenderId: "685388058525",
    appId: "1:685388058525:web:77dafea83b88b620e9a974",
    measurementId: "G-8C5N4Z77YP"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;

/**
 * Re-renders an HTML element by its id. Listeners will have to be re-attached after calling this method.
 * @param pageID
 * @param DOMElement
 */

export function rerender(pageID, DOMElement) {
    ReactDOM.render(DOMElement, document.getElementById(pageID));
}
