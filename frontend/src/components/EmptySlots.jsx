import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import getBackendUrl from '../utils/getBackendUrl';
import axios from 'axios';

const EmptySlots = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        if (!currentUser?.uid) {
            setErrorMessage("User not found...");
            setLoading(false);
            return;
        }

        const now = new Date();
        const localISOString = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 19); // Remove 'Z' (keeps local time)

        const fetchEmptySlots = async () => {
            try {
                const res = await axios.get(`${getBackendUrl()}/api/task/getFreeSlots`, {
                    params: { uid: currentUser.uid, date: localISOString}
                });

                const today = new Date(now);
                today.setHours(23, 59, 59, 999);

                const availableSlots = (res.data.freeSlots || []).filter((slot) => {
                    const start = new Date(slot.start).getTime();
                    const end = new Date(slot.end).getTime();
                    return start >= now.getTime() && end <= today.getTime();
                });
                if(availableSlots.length===0){
                    setSlots([{start:new Date(), end:new Date(today)}]);
                }
                else{
                    setSlots(availableSlots);
                }
            } catch (err) {
                setErrorMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmptySlots();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="w-65 h-80 bg-secondary rounded-sm border border-zinc-600 p-2 flex flex-col gap-4">
                <p className="text-white">Available Slots for Today</p>
                <p className="text-white text-center">Loading...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-65 h-80 bg-secondary rounded-sm border border-zinc-600 p-2 flex flex-col gap-4">
                <p className="text-white">Available Slots for Today</p>
                <p className="text-red-400 text-center">{errorMessage}</p>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="w-65 h-80 bg-secondary rounded-sm border border-zinc-600 p-2 flex flex-col gap-4">
                <p className="text-white">Available Slots for Today</p>
                <p className="text-white text-center">No empty slots. Try removing some tasks.</p>
            </div>
        );
    }

    return (
        <div className="w-65 h-80 bg-secondary rounded-sm border border-zinc-600 p-2 flex flex-col gap-4 shadow-sm shadow-zinc-500">
            <p className="text-white">Available Slots for Today</p>
            <div className="w-full flex flex-col bg-zinc-800 p-2 gap-2 items-center overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {slots.map((slot, index) => (
                    <div key={index} className="w-[90%] bg-secondary">
                        <ul className="w-full bg-secondary rounded-sm p-2 text-center border-[1px] border-zinc-500 hover:border-white duration-300">
                            <li className='text-white'>
                                {new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
                                {" to "} 
                                {new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmptySlots;
