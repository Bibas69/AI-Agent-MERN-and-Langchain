import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios';
import getBackendUrl from '../utils/getBackendUrl';
import CountdownCircle from './CountdownCircle';

const InProgressTask = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if(!currentUser){
            setErrorMessage("User not found...");
            setLoading(false);
            return;
        }
        const fetchInProgressTask = async () => {
            try{
                const now = new Date();
                const res = await axios.get(`${getBackendUrl()}/api/task/getTaskBySingleDate`, {
                    params: {uid: currentUser.uid, date: new Date(now)}
                })
                const inProgressTask = res.data.tasks.filter((task) => new Date(task.endTime)>now && new Date(task.startTime)<now);
                setTask(inProgressTask || []);
            }
            catch(err){
                setErrorMessage(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchInProgressTask();
        const interval = setInterval(fetchInProgressTask, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    

    if(loading){
        return(
            <div className='w-140 h-30 bg-secondary rounded-md border-[1px] border-zinc-700 p-2 shadow-sm shadow-zinc-500'>
                <p className='text-white'>Task in Progress</p>
                <p className='text-white'>Loading...</p>
            </div>
        )
    }

    if(errorMessage){
        return(
            <div className='w-140 h-30 bg-secondary rounded-md border-[1px] border-zinc-700 p-2 flex flex-col gap-4 shadow-sm shadow-zinc-500'>
                <p className='text-white'>Task in Progress</p>
                <p className='text-red-500 text-center'>{errorMessage}</p>
            </div>
        )
    }

    if(task.length===0){
        return(
            <div className='w-140 h-30 bg-secondary rounded-md border-[1px] border-zinc-700 p-2 flex flex-col gap-4 shadow-sm shadow-zinc-500'>
                <p className='text-white'>Task in Progress</p>
                <p className='text-white text-center'>No task in progress currently.</p>
            </div>
        )
    }

  return (
    <div className='w-140 bg-secondary rounded-md border-[1px] border-zinc-600 p-2 shadow-sm shadow-zinc-500'>
        <p className='text-white mb-2'>Task in Progress</p>
        <div className='w-full flex flex-col gap-4'>
            <div className='w-full bg-zinc-800 border-[1px] border-zinc-600 hover:border-white duration-300 rounded-sm p-4 flex justify-between'>
                <div>
                    <p className='text-white font-semibold mb-1'>{task[0].task}</p>
                    <p className='text-white text-sm'>Started: {new Date(task[0].startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <CountdownCircle endTime={task[0].endTime} startTime={task[0].startTime}/>
            </div>
            <div className='w-full flex items-center justify-center gap-10'>
                <button className='w-24 h-8 border-[1px] border-green-500 rounded-sm text-white hover:bg-green-500 duration-300'>Finish</button>
                <button className='w-24 h-8 border-[1px] border-red-500 text-white rounded-sm hover:bg-red-500 duration-300'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default InProgressTask