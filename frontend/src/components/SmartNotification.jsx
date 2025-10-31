import axios from 'axios'
import React, { useEffect, useState } from 'react'
import getBackendUrl from '../utils/getBackendUrl'
import { useAuth } from '../context/AuthContext'

const SmartNotification = () => {
    const { currentUser,  } = useAuth();
    const [message, setMessage] = useState("");
    const [tasks, setTasks] = useState([]);
    const [currentIndex, setCurrentIndex ] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!currentUser.uid) return;
        const fetchTasks = async () => {
            const now = new Date();
            try{
                let date = new Date().toLocaleDateString();
                const res = await axios.get(`${getBackendUrl()}/api/task/getTaskBySingleDate`, {
                    params: {
                        uid: currentUser.uid,
                        date: date
                    }
                })
                const filteredTasks = res.data.tasks.filter((task) => (
                    new Date(task.startTime).getTime() >= new Date(now).getTime()
                ))
                console.log(filteredTasks);
                setTasks(filteredTasks || []);
            }
            catch(err){
                setMessage(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    useEffect(() => {
        if(tasks.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (
                prevIndex+1 < tasks.length ? prevIndex+1 : 0
            ));
        }, 5000);
        return () => clearInterval(interval);
    }, [tasks])

    const currentTask = tasks[currentIndex];
    const currentTaskDate = new Date(currentTask?.startTime) || null;
    const currentTaskTime = currentTaskDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    const previous = () => {
        setCurrentIndex(currentIndex-1);
    }

    const next = () => {
        setCurrentIndex(currentIndex+1);
    }

    if(loading){
        return(
            <div className='w-140 h-40 bg-secondary border-[1px] border-zinc-700 p-2 flex flex-col gap-4 rounded-sm shadow-sm shadow-zinc-500'>
                <p className='text-white text-center'>Loading...</p>
            </div>
        )
    }

    if(message){
        return(
            <div className='w-140 h-40 bg-secondary border-[1px] border-zinc-700 p-2 flex flex-col gap-4 rounded-sm shadow-sm shadow-zinc-500'>
                <p className='text-red-500 text-center'>{message}</p>
            </div>
        )
    }

  return (
    <div className='w-140 h-40 bg-secondary border-[1px] border-zinc-700 p-2 flex flex-col gap-2 rounded-sm shadow-sm shadow-zinc-500'>
        <p className='text-white'>Smart Notification</p>
        <div className='text-white flex justify-center'>
            {
                tasks.length === 0
                ? <p className='text-white'>No tasks scheduled for today. Add some tasks!"</p>
                : currentTask?
                <div className='w-[90%] h-10 rounded-sm bg-zinc-800 border-[1px] border-zinc-500 hover:border-white duration-300'>
                    <p key={currentIndex} className='text-white text-center py-2 animate-fadeIn'>{currentTask.task} at {currentTaskTime}</p>
                </div>
                :
                <p>Loading...</p>
            }
        </div>
        <div className='w-full h-full flex items-center justify-around'>
            <button className='w-30 h-8 border-[1px] border-pink-500 text-white rounded-sm hover:bg-pink-700 duration-300' onClick={()=>previous()}>Prev</button>
            <button className='w-30 h-8 border-[1px] border-pink-500 text-white rounded-sm hover:bg-pink-700 duration-300' onClick={()=>next()}>Next</button>
        </div>
    </div>
  )
}

export default SmartNotification