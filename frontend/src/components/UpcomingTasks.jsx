import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import getBackendUrl from '../utils/getBackendUrl';
import axios from 'axios';

const UpcomingTasks = () => {

    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [groupedTasks, setGroupedTasks] = useState({});

    useEffect(() => {
        if (!currentUser) return setErrorMessage("Error: User not found...");
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${getBackendUrl()}/api/task/all`, {
                    params: { uid: currentUser.uid }
                });
                setTasks(res.data.tasks || []);
                setLoading(false);
            }
            catch (err) {
                setErrorMessage(err.message);
                setLoading(false);
            }
        }
        fetchTasks()
    }, [currentUser]);

    useEffect(() => {
        if (!loading) {
            if (!tasks || tasks.length === 0) return setErrorMessage("No tasks found...");
            const now = new Date();
            const upcomingTasks = tasks.filter(task => new Date(task.startTime) >= now).reduce((groups, task) => {
                const date = new Date(task.startTime).toLocaleDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(task);
                return groups;
            }, {})
            setGroupedTasks(upcomingTasks);
        }
    }, [tasks, loading]);

    if (loading) {
        return (
            <div className='w-140 h-40 bg-secondary rounded-sm border-[1px] border-zinc-600 shadow-sm shadow-zinc-500'>
                <p>Upcoming Tasks</p>
                <p className='text-white'>Loading...</p>
            </div>
        )
    }

    if (errorMessage) {
        return (
            <div className='w-140 h-40 bg-secondary rounded-sm border-[1px] border-zinc-600 shadow-sm shadow-zinc-500'>
                <p>Upcoming Tasks</p>
                <p className='text-red'>{errorMessage}</p>
            </div>
        )
    }

    return (
        <div className='w-140 h-80 bg-secondary rounded-sm border-[1px] border-zinc-600 p-2 flex flex-col gap-2 shadow-sm shadow-zinc-500'>
            <p className='text-white'>Upcoming Tasks</p>
            <div className='w-full flex flex-col gap-4 items-center overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                {
                    Object.keys(groupedTasks).length === 0 ? (<p className='text-white'>No upcoming tasks...</p>)
                        :
                        (
                            Object.entries(groupedTasks).map(([date, dateTasks]) => (
                                <div key={String(date)} className='w-[90%] bg-zinc-800 border-[1px] border-zinc-500 rounded-sm flex flex-col gap-2'>
                                    <p className='text-white font-semibold p-2'>Date: {date}</p>
                                    <ul className='flex flex-col gap-2 rounded-sm p-2'>
                                        {
                                            dateTasks.map((task, index) => (
                                                <li key={index} className='text-white w-full bg-secondary border-[1px] border-zinc-600 p-2 hover:border-white duration-300'>* {task.task} at {new Date(task.startTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ))
                        )
                }
            </div>

        </div>
    )
}

export default UpcomingTasks