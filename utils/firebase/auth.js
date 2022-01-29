import {useEffect, useState} from 'react'
import {auth, db} from './firebase'

export const NOT_STARTED = true;
export const FINISHED = false;

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(NOT_STARTED);
    const [userData, setUserData] = useState(null);
// listen for Firebase state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authState) => {
            const authStateChanged = async (authState) => {
                if (!authState) {
                    setAuthUser(null)
                    setLoading(FINISHED)
                    return;
                }
                const userData = (await db.collection("users").doc(authState.uid).get()).data();
                const userProjects = (await db.collection("users").doc(authState.uid).collection("projects"));
                await userProjects.get().then((querySnapshot) => {
                    const tempDoc = {}
                    querySnapshot.forEach((doc) => {
                        tempDoc[doc.id] = { ...doc.data() }
                    })
                    userData.projects = tempDoc;
                })
                const userEvents = (await db.collection("users").doc(authState.uid).collection("events"));
                await userEvents.get().then((querySnapshot) => {
                    const tempDoc = {}
                    querySnapshot.forEach((doc) => {
                        tempDoc[doc.id] = { ...doc.data() }
                    })
                    userData.events = tempDoc;
                })
                setAuthUser(authState);
                setUserData(userData);
                setLoading(FINISHED);
            }
            authStateChanged(authState).then(() => unsubscribe());
        });
    }, []);
    return {
        authUser: authUser,
        loading: loading,
        userData: userData
    };
}