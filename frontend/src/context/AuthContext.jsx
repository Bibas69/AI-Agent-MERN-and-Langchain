import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
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

    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    }

    const logoutUser = async () => {
        return await signOut(auth);
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
        logoutUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}