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
        ).toISOString().slice(0, 19);

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

    // Calculate duration of a slot in hours and minutes
    const calculateDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const totalMinutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0 && minutes > 0) {
            return { hours, minutes, display: `${hours}h ${minutes}m` };
        } else if (hours > 0) {
            return { hours, minutes: 0, display: `${hours}h` };
        } else {
            return { hours: 0, minutes, display: `${minutes}m` };
        }
    };

    // Get color based on duration
    const getDurationColor = (hours, minutes) => {
        const totalMinutes = hours * 60 + minutes;
        if (totalMinutes >= 120) return 'from-green-500 to-emerald-600'; // 2+ hours
        if (totalMinutes >= 60) return 'from-blue-500 to-cyan-600'; // 1+ hour
        return 'from-orange-500 to-amber-600'; // Less than 1 hour
    };

    const getSlotIndex = (index) => {
        return String(index + 1).padStart(2, '0');
    };

    if (loading) {
        return (
            <div className="w-65 h-80 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/60 p-6 backdrop-blur-sm">
                <div className='flex items-center gap-3 mb-6'>
                    <div className='relative'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30'>
                            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping'></div>
                    </div>
                    <div>
                        <p className='text-white text-base font-bold'>Free Slots</p>
                        <p className='text-slate-400 text-xs'>Today's availability</p>
                    </div>
                </div>
                <div className='flex items-center justify-center h-48'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            <div className='w-12 h-12 border-4 border-slate-700 rounded-full'></div>
                            <div className='absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin'></div>
                        </div>
                        <p className='text-slate-400 text-sm'>Scanning schedule...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-65 h-80 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/60 p-6">
                <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-white text-base font-bold'>Free Slots</p>
                        <p className='text-slate-400 text-xs'>Today's availability</p>
                    </div>
                </div>
                <div className='bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3'>
                    <svg className='w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                    </svg>
                    <div>
                        <p className='text-red-300 text-sm font-medium mb-1'>Error Loading Slots</p>
                        <p className='text-red-400/80 text-xs'>{errorMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="w-65 h-80 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/60 p-6">
                <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center'>
                        <svg className='w-5 h-5 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-white text-base font-bold'>Free Slots</p>
                        <p className='text-slate-400 text-xs'>Today's availability</p>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center h-48 gap-5'>
                    <div className='relative'>
                        <div className='w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700'>
                            <svg className='w-10 h-10 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                        <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30'>
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-slate-300 text-sm font-medium mb-1'>Fully Booked</p>
                        <p className='text-slate-500 text-xs'>No free time slots available today</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-65 h-80 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/60 p-6 flex flex-col">
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='relative'>
                        <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30'>
                            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50'></div>
                    </div>
                    <div>
                        <p className='text-white text-base font-bold'>Free Slots</p>
                        <p className='text-slate-400 text-xs'>Today's availability</p>
                    </div>
                </div>
                <div className='px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg'>
                    <p className='text-green-400 text-xs font-bold'>{slots.length} Available</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {slots.map((slot, index) => {
                    const duration = calculateDuration(slot.start, slot.end);
                    const colorClass = getDurationColor(duration.hours, duration.minutes);
                    
                    return (
                        <div 
                            key={index} 
                            className="group relative bg-gradient-to-br from-slate-800/50 to-zinc-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        >
                            {/* Gradient accent bar */}
                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorClass}`}></div>
                            
                            <div className='p-4 pl-5'>
                                {/* Slot number and duration badge */}
                                <div className='flex items-center justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-slate-500 text-xs font-mono'>#{getSlotIndex(index)}</span>
                                        <div className='w-1 h-1 bg-slate-600 rounded-full'></div>
                                        <span className='text-slate-400 text-xs'>Free Slot</span>
                                    </div>
                                    <div className={`px-2.5 py-1 bg-gradient-to-r ${colorClass} rounded-md shadow-lg`}>
                                        <p className='text-white text-xs font-bold'>{duration.display}</p>
                                    </div>
                                </div>

                                {/* Time display */}
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1 bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30'>
                                        <p className='text-slate-500 text-[9px] uppercase tracking-wider mb-0.5'>From</p>
                                        <p className='text-white text-sm font-bold'>
                                            {new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>

                                    <div className='flex-shrink-0'>
                                        <svg className='w-4 h-4 text-slate-600 group-hover:text-slate-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                        </svg>
                                    </div>

                                    <div className='flex-1 bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30'>
                                        <p className='text-slate-500 text-[9px] uppercase tracking-wider mb-0.5'>Until</p>
                                        <p className='text-white text-sm font-bold'>
                                            {new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmptySlots;