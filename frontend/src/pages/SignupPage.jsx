import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import getBackendUrl from '../utils/getBackendUrl';

const SignupPage = () => {
    const { signInWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try{
            await signInWithGoogle();
            const res = await axios.post(`${getBackendUrl()}/api/user`, {
                uid: currentUser.uid,
                email: currentUser.email,
                username: currentUser.username
            })
            res.data.isProfileIncomplete ? navigate("/complete_detail") : navigate("/");
        }
        catch (err){
            alert({
                success: false,
                message: "Sign up failed",
                error: err.message
            })
        }
    }

    return (
        <form action="#" className='bg-primary w-screen h-screen flex items-center justify-center'>
            <button onClick={handleGoogleSignIn} className='bg-[#000000] flex gap-2 items-center justify-center p-2 rounded-md border-1 border-zinc-200'>
                <FcGoogle className='text-2xl' />
                <p className='text-maintext font-primary tracking-wider font-lighter'>Sign up with Google</p>
            </button>
        </form>
    )
}

export default SignupPage