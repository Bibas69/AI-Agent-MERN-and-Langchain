import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    };

    const logoutUser = async () => {
        return await signOut(auth);
    };

    const setUpRecaptcha = (number) => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, number, recaptchaVerifier);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                const {uid, email, displayName} = user;
                const userData = {
                    uid,
                    email,
                    username: displayName
                }
                setCurrentUser(userData);
            }
            else{
                setCurrentUser(null);
            }
            setLoading(false);        
        })
        return () => unsubscribe();
    }, [])




    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        registerUser,
        loginUser,
        logoutUser,
        setUpRecaptcha
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}